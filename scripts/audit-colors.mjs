#!/usr/bin/env node
// 审计组件内是否残留硬编码颜色（#6：组件必须只用 --lume-* 主题变量）
// 允许：var(--lume-*)、box-shadow 里的 rgba、white-space 等非颜色用法。
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = new URL('../src/components/', import.meta.url).pathname
const COLOR = /#[0-9a-fA-F]{3,8}\b|\bwhite\b|\bblack\b|rgba?\(/
const ALLOW = [/var\(--lume/, /box-shadow/, /white-space/, /currentColor/, /transparent/]

let bad = 0
for (const name of readdirSync(dir)) {
  if (!name.endsWith('.vue')) continue
  const lines = readFileSync(join(dir, name), 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (!COLOR.test(line)) return
    if (ALLOW.some((re) => re.test(line))) return
    console.error(`${name}:${i + 1}: 硬编码颜色 -> ${line.trim()}`)
    bad++
  })
}
if (bad) {
  console.error(`\n[audit] 发现 ${bad} 处硬编码颜色；请改用 --lume-* 变量。`)
  process.exit(1)
}
console.log('[audit] OK：组件内无硬编码颜色（仅使用 --lume-*）')
