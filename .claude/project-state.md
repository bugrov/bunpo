# Состояние проекта Bunpo

Обновляется в конце каждого шага и при появлении неоднозначностей. Архитектура и соглашения: `CLAUDE.md`. Правила кода и ревью: `.claude/skills/nuxt-review/SKILL.md`.

## Текущий шаг
**Шаг 1: дизайн-система и именованные роуты.** Реализован и проверен, `/code-review` выполнен, замечания исправлены. Ждёт «ок» пользователя на коммит.

## Сделано
- Шаг 0 закоммичен и запушен (`a33aba4`): каркас Nuxt 4, Tailwind v4, ESLint/Stylelint, Vitest, Playwright, CI.
- Шаг 1 (не закоммичен, изменения в индексе):
  - `shared/routes.ts` (`ROUTE` as const: `home`, `styleguide`), `shared/types/index.ts` (`RouteName`). Импорт в страницах явный: `#shared/routes`.
  - Компоненты `app/components/ui/`: `UiButton`, `UiInput`, `UiLabel`, `UiField`, `UiCard`, `UiBadge`, типы props в `ui/types.ts`. BEM + `@apply`, `@reference` на `main.css`.
  - Тонкие страницы `app/pages/index.vue`, `app/pages/styleguide.vue` → `components/pages/HomePage.vue`, `StyleguidePage.vue` (витрина `/styleguide`).
  - ESLint: запрет строковых путей в `navigateTo(...)` и статического `to="..."` у NuxtLink/RouterLink.
  - Тесты (написаны до реализации): `tests/unit/routes.test.ts` (имя у каждой страницы, уникальность, тонкие страницы), `tests/unit/ruleset.test.ts` (правила навигации), `tests/nuxt/ui.test.ts` (компоненты), `tests/e2e/styleguide.spec.ts`.
  - Исправления по `/code-review`: окончания строк приведены к LF (`.gitattributes`, `.editorconfig`), `no-restricted-syntax` в файлах типов больше не отключается целиком, запреты `navigateTo({ path })` и `:to="'/x'"`, токен `--success`, типы `tel`/`url` и disabled у `UiInput`, удалён неиспользуемый `RouteName`.
  - Все проверки зелёные: typecheck, lint, lint:style, vitest (30), playwright (6: mobile + desktop). Визуальная проверка скриншотом выполнена.

## Решения шага 1
- `Ui*` собраны на нативных элементах с BEM (без обёрток над shadcn), чтобы не дублировать стили. shadcn-vue подключаем позже для сложных компонентов (dialog, select, tabs). Для этого `components.json` уже указывает `ui` → `@/components/ui/shadcn`.
- Модуль `shadcn-nuxt` и пакет убраны из зависимостей до первого shadcn-компонента (иначе предупреждение про отсутствующую папку). Вернуть вместе с `shadcn: { componentDir: './app/components/ui/shadcn' }`.
- Иконки: Lucide (`iconLibrary` в `components.json`), пакет пока не установлен; сделаем обёртку `UiIcon`, когда понадобится первая иконка.
- `ROUTE` лежит в `shared/routes.ts` (не в `shared/utils`), поэтому не автоимпортируется: импорт `#shared/routes`.

## Замечания
- TypeScript закреплён на `~6.0`: typescript-eslint не поддерживает TS 7.
- FSD-правило ESLint ловит только явные импорты, автоимпортируемые компоненты не видит: проверять на ревью.
- `/styleguide` существует только в dev: `config/devPages.ts` (`removeDevOnlyPages`) подключён хуком `pages:extend` в `$production`. Проверено production-сборкой: `/` отдаёт 200, `/styleguide` 404.
- `tests/unit/ruleset.test.ts` поднимает ESLint (около 3 секунд), это нормально.

## Следующие шаги
2. Контент: zod-схема пункта (`shared/schemas`), YAML-загрузчик, парсер фуриганы, `<Ruby>`, `validate-content`, 3 образцовых пункта.
3. БД (Drizzle + Neon Pool) и авторизация (nuxt-auth-utils), `security-guidance`.
4. Урок и упражнения. 5. SRS. 6. Экраны. 7. PWA и деплой. 8. Контент N5 и далее.

## На обсуждении / неоднозначное
- Формат ревью контента (status draft/reviewed + просмотр в приложении) — обсудить до шага 8.
