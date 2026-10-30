# Состояние проекта Bunpo

Обновляется в конце каждого шага и при появлении неоднозначностей. Архитектура и соглашения: `CLAUDE.md`. Правила кода и ревью: `.claude/skills/nuxt-review/SKILL.md`.

## Текущий шаг
**Шаг 0: каркас проекта.** Реализован и проверен, ждёт ревью и «ок» пользователя на коммит. Коммитов в репозитории пока нет.

## Сделано в шаге 0
- `git init -b main`, remote `origin` = git@github.com:bugrov/bunpo.git.
- `CLAUDE.md`, скилл `nuxt-review`, этот файл.
- Nuxt 4.6 (pnpm), Tailwind v4 через `@tailwindcss/vite`, shadcn-nuxt (`components.json`, `app/lib/utils.ts` с `cn`), тема Acid Lime в `app/assets/css/main.css` (только тёмная, `html.dark`).
- Автоимпорт компонентов с `pathPrefix: false`, заготовка страницы `app/pages/index.vue`.
- ESLint: typescript-eslint strictTypeChecked + stylisticTypeChecked, `curly: all`, пустая строка перед `return`, запрет `any`, `as unknown as`, `sql.raw`, объявлений типов вне `types/`, импортов вверх по слоям FSD. Проверено на заведомо плохом файле.
- Stylelint (standard + vue + postcss-html), BEM-паттерн классов, директивы Tailwind (`@apply`, `@reference`) разрешены. Совместимость с Tailwind v4 проверена на тестовых файлах.
- Vitest 5 (проекты `unit` и `nuxt`), Playwright (mobile Pixel 7 + desktop), тест `cn` и e2e-smoke.
- Скрипты: `typecheck`, `lint`, `lint:fix`, `lint:style`, `test`, `test:e2e`. `tsconfig` покрывает тесты и конфиги (`typescript.nodeTsConfig.include`).
- CI: `.github/workflows/ci.yml` (typecheck, lint, lint:style, test, e2e).
- Все проверки зелёные: typecheck, lint, lint:style, test (2), test:e2e (2).

## Замечания по шагу 0
- TypeScript закреплён на `~6.0`: typescript-eslint не поддерживает TS 7. Вернуться к 7, когда будет поддержка (>=7.1).
- Предупреждение Nuxt «Component directory does not exist: app/components/ui» исчезнет в шаге 1, когда появятся компоненты.
- Правило FSD в ESLint ловит только явные импорты (`~/components/...`), автоимпортируемые компоненты оно не видит. Это ограничение подхода, нужны ревью-проверки.
- Правило «типы только в отдельных файлах» запрещает `interface`/`type` везде, кроме `types.ts`, `types/**` и `*.d.ts`. По решению пользователя типы props и локальные типы лежат в `types.ts` рядом с компонентами (в папке слайса). Проверено на тестовых файлах.
- `/code-review` не запускался: нет коммита и диффа. Ревью шага выполнено вручную по чек-листу `nuxt-review`.
- В зависимостях есть `@vueuse/core` (нужен компонентам shadcn-vue) и `tw-animate-css` (анимации shadcn).

## Следующие шаги
1. Дизайн-система `Ui*` (BEM), `shared/routes.ts`, тест на имена роутов, добавление shadcn-компонентов через CLI.
2. Контент: zod-схема, YAML-загрузчик, парсер фуриганы, `<Ruby>`, 3 образцовых пункта.
3. БД (Drizzle + Neon Pool) и авторизация (nuxt-auth-utils), `security-guidance`.
4. Урок и упражнения. 5. SRS. 6. Экраны. 7. PWA и деплой. 8. Контент N5 и далее.

## Решения
- Nuxt 4, pnpm, только тёмная тема, палитра Acid Lime (#0B0B0C / #151517 / #D1FE17 / #F4F4F5 / ошибка #FF5D5D).
- FSD слоями внутри `app/components/`, страницы тонкие, типы в `types/index.ts`, роуты именованные.
- SRS: FSRS, Good / Hard / Again по числу ошибок; единица — пункт грамматики.
- v1 без гостевого режима, офлайн-очереди и lib/ai. Rate limit через Vercel Firewall.

## На обсуждении / неоднозначное
- Формат ревью контента (status draft/reviewed + просмотр в приложении) — обсудить до шага 8.
- Структура по FSD остаётся, пока не мешает. Обязательно: сущности и фичи по логичным папкам, без десятков компонентов в одной папке (решение пользователя).
- Где держать сырые shadcn-компоненты и наши `Ui*` обёртки внутри слоя `ui/` (подпапки или рядом) — решить в шаге 1.
