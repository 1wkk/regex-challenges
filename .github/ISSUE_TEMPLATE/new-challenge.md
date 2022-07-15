---
name: New Challenge
about: Propose a new challenge.
title: ''
labels: new-challenge
assignees: echoeureka

---

> Please follow the template and fill the info.
> Detailed solution/guide is not required, but please be sure the challenge is solvable.

## Info

Basic info of your challenge questions,

```yaml
difficulty: Bella # Carol / Diana / Eileen - Difficulty in ascending order
title: Your Question Name
```

## Question

<!--question-start-->

Describe your question and give some examples. Markdown is supported here. 

<!--question-end-->

## Template

This is the template for challengers to start the coding. Basically, you just need to leave to implementation `/ /`.

```ts
const regex = /love/
```

## Test Cases

Provide some test cases for your challenge, you can use some utils from `Vitest`.  

```ts
const Test = () => 'I love JavaScript'.search(regex)

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('add', () => {
    expect(Test()).toBe(2)
  })
}
```
