import { Ch } from './types'
import { defaultLocale } from './locales'
import { resolveInfo } from './loader'

export const REPO = 'https://github.com/ryanmoyo/regex-challenges'
export const DOMAIN = 'https://rech.vercel.app/'

export function toSolutionsFull(no: number) {
  return `${REPO}/issues?q=label%3A${no}+label%3Aanswer`
}

export function toQuizREADME(quiz: Ch, locale?: string, absolute = false) {
  const prefix = absolute ? `${REPO}/blob/master` : '.'
  return locale && locale !== defaultLocale && quiz.readme[locale]
    ? `${prefix}/questions/${quiz.path}/README.${locale}.md`
    : `${prefix}/questions/${quiz.path}/README.md`
}

export function toRawREADME(quiz: Ch, locale?: string) {
  const provider = 'https://cdn.jsdelivr.net/gh/ryanmoyo/regex-challenges'
  // const provider = 'https://raw.githubusercontent.com/ryanmoyo/regex-challenges/master'
  return locale && locale !== defaultLocale && quiz.readme[locale]
    ? `${provider}/questions/${quiz.path}/README.${locale}.md`
    : `${provider}/questions/${quiz.path}/README.md`
}

export function toQuestionsRawREADME(locale?: string) {
  const provider = 'https://cdn.jsdelivr.net/gh/ryanmoyo/regex-challenges'
  return locale && locale !== defaultLocale
    ? `${provider}/README.${locale}.md`
    : `${provider}/README.md`
}

export function toNearborREADME(quiz: Ch, locale?: string) {
  return locale && locale !== defaultLocale && quiz.readme[locale]
    ? `./README.${locale}.md`
    : './README.md'
}

export function toShareAnswerFull(quiz: Ch, locale: string = defaultLocale) {
  const info = resolveInfo(quiz, locale)
  if (locale === defaultLocale)
    return `https://github.com/ryanmoyo/regex-challenges/issues/new?labels=answer,${encodeURIComponent(
      locale
    )}&template=0-answer.md&title=${encodeURIComponent(`${quiz.no} - ${info.title}`)}`
  else
    return `https://github.com/ryanmoyo/regex-challenges/issues/new?labels=answer,${encodeURIComponent(
      locale
    )}&template=1-answer.${locale}.md&title=${encodeURIComponent(
      `${quiz.no} - ${info.title}`
    )}`
}

// Short

export function toReadmeShort(no: number, locale?: string) {
  return locale !== defaultLocale ? `${DOMAIN}/${no}/${locale}` : `${DOMAIN}/${no}`
}

export function toSolutionsShort(no: number) {
  return `${DOMAIN}/${no}/solutions`
}

export function toPlayShort(no: number, locale?: string) {
  return locale !== defaultLocale
    ? `${DOMAIN}/${no}/play/${locale}`
    : `${DOMAIN}/${no}/play`
}

export function toAnswerShort(no: number, locale?: string) {
  return locale !== defaultLocale
    ? `${DOMAIN}/${no}/answer/${locale}`
    : `${DOMAIN}/${no}/answer`
}

export function toHomepageShort(locale?: string) {
  return locale !== defaultLocale ? `${DOMAIN}/${locale}` : `${DOMAIN}`
}
