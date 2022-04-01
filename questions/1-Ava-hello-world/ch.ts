const regex = /love/

const Test = () => 'I love JavaScript'.search(regex)

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('add', () => {
    expect(Test()).toBe(2)
  })
}
