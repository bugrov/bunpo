# Состояние проекта Bunpo

Обновляется в конце каждого шага и при появлении неоднозначностей. Архитектура и соглашения: `CLAUDE.md`. Правила кода и ревью: `.claude/skills/nuxt-review/SKILL.md`.

## Текущий шаг
**Шаг 2: контент (схема, парсер, Ruby, загрузчик, 3 образцовых пункта).** Реализован, `/code-review` выполнен, замечания и пожелания пользователя учтены. Жду «ок» пользователя на коммит.

## Сделано
- Шаг 0 закоммичен (`a33aba4`), шаг 1 закоммичен (`336575c`), оба запушены в `origin/main`.
- Шаг 2 (не закоммичен, изменения в индексе):
  - `shared/schemas/grammar.ts`: zod-схема пункта (`grammarPointSchema`, `exerciseSchema`, `grammarIdSchema`), типы в `shared/types/index.ts` (`GrammarPoint`, `Exercise`, `FuriganaSegment`).
  - `shared/utils/furigana.ts` (`parseFurigana`, `stripFurigana`), `shared/utils/grammarYaml.ts` (`parseGrammarYaml`).
  - `app/components/ui/UiRuby.vue`, `app/composables/useFurigana.ts` (`useState`, пока без сохранения в настройках).
  - Контент (draft): `content/grammar/n5/n5-wa-desu.yaml`, `n5/n5-te-kudasai.yaml`, `n4/n4-chau.yaml` (разговорный).
  - `server/utils/grammar.ts` (загрузчик через `useStorage('assets:content')`, кэш в production), `server/api/grammar/index.get.ts` (список), `server/api/grammar/[id].get.ts` (пункт, 400 на плохой id, 404 на неизвестный). `nitro.serverAssets` в `nuxt.config.ts`.
  - `pnpm validate:content` запускает проверку схемы и всего контента (тесты `content.test.ts`, `grammarSchema.test.ts`): уникальные id, имя файла = id, папка = уровень, ссылки `related`/`prerequisites` существуют, нет циклов.
  - Проверено на production-сборке: API отдаёт 200/404/400, `/styleguide` 404.
  - Все проверки зелёные: typecheck, lint, lint:style, vitest (70), playwright (16).

## Решения шага 2
- Упражнения лежат в том же YAML, что и пункт (ключ `exercises`). Пропуски в cloze: `{{ответ|вариант2}}`; фуригана: `{漢字|かんじ}`. Подтверждено пользователем.
- Вместо `scripts/validate-content.ts` валидация сделана тестами (`pnpm validate:content`): проще и работает в CI.
- Диалоги в схеме отдельным ключом `dialogues` (минимум один), примеры `examples` 4–6, упражнений минимум 4.
- `choice` хранит `answerIndex`; `reorder` хранит слова в правильном порядке (перемешивание в UI); `translate` хранит допустимые ответы списком.
- Публичный API грамматики пока без кэширования `routeRules` (добавить на шаге деплоя).
- Валидация входа на сервере: `server/utils/zodValidator.ts` (адаптер на `safeParse`, невалидный ввод даёт `false` и ответ 400 без деталей). `grammarParamsSchema` лежит в `shared/schemas/grammar.ts`.
- Структура `ui/` переведена на папки по компонентам (`ui/badge/UiBadge.vue` + `ui/badge/types/index.ts`), PascalCase-имена файлов, barrel `index.ts` не заводим до появления потребителя. Для сканирования компонентов `extensions: ['vue']`, иначе Nuxt принимает `types/index.ts` за компоненты.
- `@reference` в стилях компонентов писать не нужно: плагин `config/tailwindReference.ts` (Vite, `enforce: 'pre'`, стоит перед `tailwindcss()` в `nuxt.config.ts`) дописывает его в каждый `<style>` с `@apply`. Регрессия покрыта e2e-тестом на вычисленные стили. Добавлена devDependency `vite@8.3.5` (только типы для плагина, версия совпадает с Nuxt).
- Стили компонентов переведены на SCSS (`<style lang="scss" scoped>`, BEM-вложенность `&__element`, `&--modifier`, внутри `@apply`). Tailwind подключён через PostCSS (`@tailwindcss/postcss`, `postcss.plugins` в `nuxt.config.ts`), а не Vite-плагином: Vite-плагин Tailwind обрабатывает только `.css`, SCSS пропускает. Плагин `config/tailwindReference.ts` по-прежнему дописывает `@reference`. В `main.css` импорт `tailwindcss/index.css` (явный путь), иначе падает SSR-сборка. Пакет `tw-animate-css` удалён, вернуть вместе с shadcn.
- Stylelint: `stylelint-config-standard-scss` + `stylelint-config-standard-vue/scss`. Вложенный BEM проверяет `selector-nested-pattern` (selector-class-pattern пропускает `&_suffix`). Проверено негативным примером.
- `main.css`: `@layer base` с цветом границ по умолчанию (`var(--border)`, в v4 иначе `currentColor`) и тонкий скроллбар на всём сайте (`scrollbar-width: thin`, webkit-вариант для Safari).
- Семантика: ESLint запрещает `@click` и подобные на `div/span/p/li/ul/ol/section/article/header/footer/main/aside/nav/img/h1-h6`. Кликабельное только `button` или `a`/`NuxtLink`.
- Тест на применение стилей ослаблен (не прозрачный фон и не нулевой радиус), без точных цветов.
- Три точки экрана на стандартных брейкпоинтах Tailwind (по решению пользователя именование sm/md/lg/xl оставлено): мобайл (по умолчанию), планшет `md:` (от 768px), ПК `lg:` (от 1024px). Приоритет мобайл и ПК, планшет пользователь проверяет сам. Правило «новый экран сразу под три точки» зафиксировано в `CLAUDE.md` и скилле. Пока адаптивность затронула только главную (`md:px-8 lg:px-12`), основная вёрстка адаптива будет на шаге 6 (нижняя навигация на мобайле, боковая панель на ПК).
- `UiButton` размера `sm` на сенсорных экранах получает высоту 44px (`pointer-coarse:h-11`).
- `CLAUDE.md` и скилл обновлены (SCSS, PostCSS, семантика, адаптивность, тесты на логику, визуальные проверки по согласованию).
- Правила работы от пользователя: визуальные проверки в браузере только после вопроса; тесты только на логику и поведение, не на косметику (см. память проекта).
- `CLAUDE.md` обновлён с разрешения пользователя (структура компонентов, типы, `zodValidator`, формат упражнений и пропусков), так же скилл `nuxt-review`.
- Исправлено по `/code-review`: отказ загрузки не кэшируется, дубли id ловятся при загрузке, пробельные ответы отклоняются, `<rp>` у фуриганы, единый источник regex фуриганы, сортировка без `localeCompare`.

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
3. БД (Drizzle + Neon Pool) и авторизация (nuxt-auth-utils), `security-guidance`.
4. Урок и упражнения. 5. SRS. 6. Экраны. 7. PWA и деплой. 8. Контент N5 и далее.

## На обсуждении / неоднозначное
- Формат ревью контента (status draft/reviewed + просмотр в приложении) — обсудить до шага 8.
