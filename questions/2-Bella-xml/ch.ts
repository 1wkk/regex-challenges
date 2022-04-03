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
