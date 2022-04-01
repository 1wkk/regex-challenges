import path from 'path'
import fs from 'fs-extra'
import { defaultLocale, f, SupportedLocale, supportedLocales, t } from './locales'
import { lsChs, resolveInfo } from './loader'
import { toNearborREADME, toQuizREADME } from './toUrl'
import { Ch, ChMetaInfo } from './types'

const DifficultyColors: Record<string, string> = {
  Ava: '9AC8E2',
  Bella: 'DB7D74',
  Carol: 'B8A6D9',
  Diana: 'E799B0',
  Eileen: '576690'
}

const DifficultyRank = ['Ava', 'Bella', 'Carol', 'Diana', 'Eileen']

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function toBadgeURL(label: string, text: string, color: string, args = '') {
  return `https://img.shields.io/badge/${encodeURIComponent(
    label.replace(/-/g, '--')
  )}-${encodeURIComponent(text.replace(/-/g, '--'))}-${color}${args}`
}

function toBadge(label: string, text: string, color: string, args = '') {
  return `<img src="${toBadgeURL(label, text, color, args)}" alt="${text}"/>`
}

export function toBadgeLink(
  url: string,
  label: string,
  text: string,
  color: string,
  args = ''
) {
  return `<a href="${url}" target="_blank">${toBadge(label, text, color, args)}</a> `
}

export function toPlanTextLink(
  url: string,
  _label: string,
  text: string,
  _color: string,
  _args = ''
) {
  return `<a href="${url}" target="_blank">${text}</a> `
}

function toAuthorInfo(author: Partial<ChMetaInfo['author']> = {}) {
  return `by ${author.name}${
    author.github
      ? ` <a href="https://github.com/${author.github}" target="_blank">@${author.github}</a>`
      : ''
  }`
}

function toDifficultyBadge(difficulty: string, locale: SupportedLocale) {
  return toBadge(
    '',
    t(locale, `difficulty.${difficulty}`),
    DifficultyColors[difficulty]
  )
}

function toDifficultyBadgeInverted(
  difficulty: string,
  locale: SupportedLocale,
  count: number
) {
  return toBadge(
    t(locale, `difficulty.${difficulty}`),
    count.toString(),
    DifficultyColors[difficulty]
  )
}

function toDifficultyPlainText(
  difficulty: string,
  locale: SupportedLocale,
  count: number
) {
  return `${t(locale, `difficulty.${difficulty}`)} (${count.toString()})`
}

function quizToBadge(quiz: Ch, locale: string, absolute = false, badge = true) {
  const fn = badge ? toBadgeLink : toPlanTextLink
  return fn(
    toQuizREADME(quiz, locale, absolute),
    '',
    `${quiz.no}・${quiz.info[locale]?.title || quiz.info[defaultLocale]?.title}`,
    DifficultyColors[quiz.difficulty]
  )
}

function quizNoToBadges(
  ids: (string | number)[],
  quizes: Ch[],
  locale: string,
  absolute = false
) {
  return ids
    .map(i => quizes.find(q => q.no === Number(i)))
    .filter(Boolean)
    .map(i => quizToBadge(i!, locale, absolute))
    .join(' ')
}

function getAllTags(quizes: Ch[], locale: string) {
  const set = new Set<string>()
  for (const quiz of quizes) {
    const info = resolveInfo(quiz, locale)
    for (const tag of info?.tags || []) set.add(tag as string)
  }
  return Array.from(set).sort()
}

function getQuizesByTag(quizes: Ch[], locale: string, tag: string) {
  return quizes.filter(quiz => {
    const info = resolveInfo(quiz, locale)
    return !!info.tags?.includes(tag)
  })
}

async function insertInfoReadme(
  filepath: string,
  quiz: Ch,
  locale: SupportedLocale,
  quizes: Ch[]
) {
  if (!fs.existsSync(filepath)) return
  let text = await fs.readFile(filepath, 'utf-8')
  /* eslint-disable prefer-template */

  if (!text.match(/<!--info-header-start-->[\s\S]*<!--info-header-end-->/))
    text = `<!--info-header-start--><!--info-header-end-->\n\n${text}`
  if (!text.match(/<!--info-footer-start-->[\s\S]*<!--info-footer-end-->/))
    text = `${text}\n\n<!--info-footer-start--><!--info-footer-end-->`

  const info = resolveInfo(quiz, locale)

  const availableLocales = supportedLocales
    .filter(l => l !== locale)
    .filter(l => !!quiz.readme[l])

  text = text
    .replace(
      /<!--info-header-start-->[\s\S]*<!--info-header-end-->/,
      '<!--info-header-start-->' +
        `<h1>${escapeHtml(info.title || '')} ${toDifficultyBadge(
          quiz.difficulty,
          locale
        )} ${(info.tags || [])
          .map((i: any) => toBadge('', `#${i}`, '999'))
          .join(' ')}</h1>` +
        `<blockquote><p>${toAuthorInfo(info.author)}</p></blockquote>` +
        '<p>' +
        (availableLocales.length
          ? '&nbsp;&nbsp;&nbsp;' +
            availableLocales
              .map(l =>
                toBadgeLink(toNearborREADME(quiz, l), '', t(l, 'display'), 'gray')
              )
              .join(' ')
          : '') +
        '</p>' +
        '<!--info-header-end-->'
    )
    .replace(
      /<!--info-header-end-->[\s\S]*<!--info-footer-start-->/,
      `<!--info-header-end-->\n\`\`\`ts\n${quiz.code.trim()}\n\`\`\`\n<!--info-footer-start-->`
    )
    .replace(
      /<!--info-footer-start-->[\s\S]*<!--info-footer-end-->/,
      '<!--info-footer-start-->' +
        toBadgeLink(
          `../../${f('README', locale, 'md')}`,
          '',
          t(locale, 'badge.back'),
          'grey'
        ) +
        '<!--info-footer-end-->'
    )

  /* eslint-enable prefer-template */

  await fs.writeFile(filepath, text, 'utf-8')
}

async function updateIndexREADME(quizes: Ch[]) {
  // update index README
  for (const locale of supportedLocales) {
    const filepath = path.resolve(__dirname, '..', f('README', locale, 'md'))

    let challengesREADME = ''
    let prev = ''

    // difficulty
    const quizesByDifficulty = [...quizes].sort(
      (a, b) =>
        DifficultyRank.indexOf(a.difficulty) - DifficultyRank.indexOf(b.difficulty)
    )

    for (const quiz of quizesByDifficulty) {
      if (prev !== quiz.difficulty)
        challengesREADME += `${prev ? '<br><br>' : ''}${toDifficultyBadgeInverted(
          quiz.difficulty,
          locale,
          quizesByDifficulty.filter(q => q.difficulty === quiz.difficulty).length
        )}<br>`

      challengesREADME += quizToBadge(quiz, locale)

      prev = quiz.difficulty
    }

    // by plain text
    prev = ''
    challengesREADME += '<br><details><summary>By Plain Text</summary><br>'
    for (const quiz of quizesByDifficulty) {
      if (prev !== quiz.difficulty)
        challengesREADME += `${prev ? '</ul>' : ''}<h3>${toDifficultyPlainText(
          quiz.difficulty,
          locale,
          quizesByDifficulty.filter(q => q.difficulty === quiz.difficulty).length
        )}</h3><ul>`
      challengesREADME += `<li>${quizToBadge(quiz, locale, false, false)}</li>`
      prev = quiz.difficulty
    }
    challengesREADME += '</ul></details><br>'

    let readme = await fs.readFile(filepath, 'utf-8')
    readme = readme.replace(
      /<!--challenges-start-->[\s\S]*<!--challenges-end-->/m,
      `<!--challenges-start-->\n${challengesREADME}\n<!--challenges-end-->`
    )
    await fs.writeFile(filepath, readme, 'utf-8')
  }
}

async function updateQuestionsREADME(quizes: Ch[]) {
  const questionsDir = path.resolve(__dirname, '../questions')

  // update each questions' readme
  for (const quiz of quizes) {
    for (const locale of supportedLocales) {
      await insertInfoReadme(
        path.join(questionsDir, quiz.path, f('README', locale, 'md')),
        quiz,
        locale,
        quizes
      )
    }
  }
}

export async function updateREADMEs(type?: 'quiz' | 'index') {
  const quizes = await lsChs()
  quizes.sort((a, b) => a.no - b.no)

  if (type === 'quiz') {
    await updateQuestionsREADME(quizes)
  } else if (type === 'index') {
    await updateIndexREADME(quizes)
  } else {
    await Promise.all([updateIndexREADME(quizes), updateQuestionsREADME(quizes)])
  }
}

updateREADMEs(process.argv.slice(2)[0] as any)
