<!--info-header-start--><h1>Match all XML tags <img src="https://img.shields.io/badge/-Bella-DB7D74" alt="Bella"/> </h1><blockquote><p>by Eureka <a href="https://github.com/ryanmoyo" target="_blank">@ryanmoyo</a></p></blockquote><p></p><!--info-header-end-->
```ts
const regex: RegExp = / /

const Test = (str: string) => regex.test(str)

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('add', () => {
    expect(Test('<city>hello</city>')).toBeTruthy()
    expect(Test('<info>haha</info>')).toBeTruthy()
    expect(Test('<div>code</div>')).toBeTruthy()
    expect(Test('<table>jn</table>')).toBeTruthy()
    expect(Test('<city>hello</cite>')).toBeFalsy()
    expect(Test('<info>haha</inf>')).toBeFalsy()
    expect(Test('<div>code</dia>')).toBeFalsy()
    expect(Test('<table>jn</tbble>')).toBeFalsy()
  })
}
```
<!--info-footer-start--><a href="../../README.md" target="_blank"><img src="https://img.shields.io/badge/-Back-grey" alt="Back"/></a> <!--info-footer-end-->