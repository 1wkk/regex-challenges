import fg from 'fast-glob'
import path from 'path'
import fs from 'fs-extra'
import YAML from 'js-yaml'

import { Ch, ChMetaInfo, Difficulty } from './types'
import { supportedLocales, defaultLocale } from './locales'

export const loadFile = async (filepath: string) => {
  if (fs.existsSync(filepath)) return await fs.readFile(filepath, 'utf-8')
  return undefined
}

export const loadLocaleVariations = async <T = string>(
  filepath: string,
  preprocessor: (s: string) => T = s => s as any as T
) => {
  const { ext, dir, name } = path.parse(filepath)
  const data: Record<string, T> = {}

  for (const locale of supportedLocales) {
    const file = preprocessor(
      (await loadFile(path.join(dir, `${name}.${locale}${ext}`))) || ''
    )

    if (file) data[locale] = file
  }

  if (!data[defaultLocale]) {
    const file = preprocessor((await loadFile(filepath)) || '')
    if (file) data[defaultLocale] = file
  }

  return data
}

export const loadInfo = (s: string): Partial<ChMetaInfo> | undefined => {
  const object = YAML.load(s) as any
  if (!object) return undefined

  const arrayKeys = ['tags', 'related']

  for (const key of arrayKeys) {
    if (object[key]) {
      object[key] = (object[key] || '')
        .toString()
        .split(',')
        .map((i: string) => i.trim())
        .filter(Boolean)
    } else {
      object[key] = undefined
    }
  }

  return object
}

export const readmeCleanUp = (text: string) => {
  return text
    .replace(/<!--info-header-start-->[\s\S]*<!--info-header-end-->/, '')
    .replace(/<!--info-footer-start-->[\s\S]*<!--info-footer-end-->/, '')
    .trim()
}

export const ENTRY = path.resolve(__dirname, '../questions')

export const lsChs = async (): Promise<Ch[]> => {
  const dirs = await fg('{0..9}*-*', {
    onlyDirectories: true,
    cwd: ENTRY
  })
  const chs = await Promise.all(dirs.map(async dir => lsCh(dir)))
  return chs
}

export const lsCh = async (dir: string): Promise<Ch> => {
  return {
    no: Number(dir.replace(/^(\d+)-.*/, '$1')),
    difficulty: dir.replace(/^\d+-(.+?)-.*$/, '$1') as Difficulty,
    path: dir,
    info: await loadLocaleVariations(path.join(ENTRY, dir, 'info.yml'), loadInfo),
    readme: await loadLocaleVariations(
      path.join(ENTRY, dir, 'README.md'),
      readmeCleanUp
    ),
    code: await loadFile(path.join(ENTRY, dir, 'ch.ts'))
  }
}

export function resolveInfo(quiz: Ch, locale: string = defaultLocale) {
  const info = Object.assign({}, quiz.info[defaultLocale], quiz.info[locale])
  info.tags = quiz.info[locale]?.tags || quiz.info[defaultLocale]?.tags || []
  info.related = quiz.info[locale]?.related || quiz.info[defaultLocale]?.related || []

  if (typeof info.tags === 'string')
    info.tags = info.tags
      // @ts-ignore
      .split(',')
      // @ts-ignore
      .map(i => i.trim())
      .filter(Boolean)

  return info as ChMetaInfo
}
