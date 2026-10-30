# Bunpo

Приложение для ежедневного изучения японской грамматики: урок (теория, практика, мини-тест) и интервальные повторения в стиле Anki. Общение с пользователем и тексты интерфейса и контента на русском.

> Этот файл не меняется в ходе разработки. Если нужна правка, сначала спросить пользователя. Текущий статус работы живёт в `.claude/project-state.md`.

## Стек
- Nuxt 4 (Vue 3, TypeScript, Nitro), менеджер пакетов pnpm.
- UI: Tailwind CSS v4 (через PostCSS) + SCSS + shadcn-vue (для сложных компонентов), тёмная тема, палитра Acid Lime, стиль как у higgsfield.ai.
- State: Pinia для общего и бизнес-состояния, `useState` только для простого UI-состояния.
- БД: Drizzle ORM + Neon Postgres (драйвер `drizzle-orm/neon-serverless`, Pool, нужен для транзакций). Миграции только через drizzle-kit.
- Валидация: zod, схемы общие для клиента и сервера (`shared/schemas`).
- Авторизация: nuxt-auth-utils (зашифрованная cookie-сессия).
- SRS: ts-fsrs. Контент: YAML + zod. PWA: @vite-pwa/nuxt.
- Тесты: Vitest (unit), Playwright (e2e). Линтеры: ESLint, Stylelint. Проверка типов: `nuxt typecheck`.
- Деплой: Vercel (подключён к git пользователем). Репозиторий: git@github.com:bugrov/bunpo.git

## Структура (Nuxt 4)
```
app/
  pages/          тонкие страницы: definePageMeta + один <XxxPage />
  components/
    ui/           дизайн-система: папка на компонент (ui/badge/UiBadge.vue, ui/badge/types/index.ts)
    entities/     grammar, user, review
    features/     lesson, review-session, settings
    widgets/      навигация, панели
    pages/        *Page.vue (разметка и логика страниц)
  composables/
  stores/
  types/index.ts  типы, общие для нескольких слоёв клиента
server/
  api/            эндпоинты Nitro
  db/schema.ts    схема Drizzle
  utils/          клиент БД, SRS, проверки прав, zodValidator
  types/index.ts  серверные типы
shared/
  schemas/        zod-схемы (клиент + сервер)
  types/index.ts  модели и DTO
  utils/          чистые функции, общие для клиента и сервера (furigana, grammarYaml)
  routes.ts       имена роутов (as const), импорт через #shared/routes
config/                          хуки сборки (devPages, tailwindReference)
content/grammar/<level>/*.yaml   пункты грамматики
```
FSD-слои внутри `app/components/`, импорты только сверху вниз: pages → widgets → features → entities → ui. Автоимпорт компонентов с `pathPrefix: false` и `extensions: ['vue']`.
Главное требование к структуре: бизнес-сущности и фишки разложены по логичным папкам (`entities/<сущность>/`, `features/<фича>/`), никаких десятков компонентов в одной папке. Если FSD начнёт мешать, его можно упростить, но логичная группировка по папкам остаётся обязательной.

## Принципы
1. Приоритеты при конфликте: корректность и безопасность, затем KISS, затем конвенции Nuxt и стиль кода, затем YAGNI, затем DRY/SOLID.
2. Подробные правила ревью и кода: проектный скилл `.claude/skills/nuxt-review/SKILL.md`. Применяется на каждом шаге.
3. Минимальное изменение под задачу, абстракции только при 2–3 реальных использованиях, новые зависимости с обоснованием.

## Соглашения
- **Типы** только в отдельных файлах, не внутри компонентов, сторов и эндпоинтов.
  - Компоненты `ui/`: папка на компонент, типы в `types/index.ts` рядом (`ui/badge/UiBadge.vue` + `ui/badge/types/index.ts`), компонент импортирует их через `./types`. Barrel `index.ts` не заводим, пока нет потребителя.
  - Слои `entities/`, `features/`, `widgets/`: типы слайса в `types.ts` в папке слайса (например `app/components/features/lesson/types.ts`).
  - Общие типы: `app/types/index.ts`, `shared/types/index.ts`, `server/types/index.ts`.
  - Типы zod через `z.infer`, типы БД через `$inferSelect`/`$inferInsert`.
- **Страницы** тонкие: логика и разметка в `<XxxPage />`.
- **Роуты** именованные: `definePageMeta({ name })`, имена в `shared/routes.ts` (`as const`). Переходы только по имени: `navigateTo({ name })`, `<NuxtLink :to="{ name }">`. Строковые пути запрещены.
- **Стили**: SCSS (`<style lang="scss" scoped>`), классы по BEM с вложенностью (`.ui-card { &__header {} &--wide {} }`), внутри `@apply` Tailwind. `@reference` писать не нужно: его добавляет `config/tailwindReference.ts`. Tailwind подключён через PostCSS, потому что Vite-плагин Tailwind не обрабатывает SCSS. В `main.css` импорт `tailwindcss/index.css` с явным путём. Цвета только через токены темы. Базовый слой (цвет границ, тонкий скроллбар) живёт в `app/assets/css/main.css`.
- **Семантика**: кликабельное это `<button>` (действие) или `<a>`/`<NuxtLink>` (переход). `@click` на `div`, `span`, `p`, `li`, `section` и т.п. запрещён ESLint. Заголовки, списки, `main`/`section`/`header`/`footer` по смыслу.
- **Адаптивность**: mobile-first, три точки экрана на стандартных брейкпоинтах Tailwind: мобайл (до 768px, по умолчанию), планшет `md:` (от 768px), ПК `lg:` (от 1024px). `sm:` и `xl:` доступны для тонкой подстройки. Приоритет у мобайла и ПК, планшет пользователь проверяет визуально сам. Каждый новый экран верстать сразу под три точки. Без горизонтальной прокрутки, тач-цели от 44px на сенсорных экранах (`pointer-coarse:`), для нижней навигации учитывать safe-area на iOS.
- **UI**: input, button, label, card и т.д. только через компоненты дизайн-системы `Ui*`, без ручной вёрстки каждый раз.
- **БД**: только Drizzle с параметрами. Запрещены `sql.raw` и N+1 (используй `with`/join). Выбирать только нужные колонки. Атомарные операции в транзакции.
- **Код**: TypeScript strict, запрещены `any` и по возможности `as unknown as`. Всегда фигурные скобки у `if`/`else`/циклов, даже для одного оператора. Пустая строка перед `return` (кроме однострочных функций и `return` как единственного оператора блока).
- **Безопасность**: проверка прав на конкретный ресурс на сервере (`where userId = session.user.id`), `requireUserSession` в защищённых эндпоинтах, входные данные только через zod и `zodValidator(schema)` (`getValidatedRouterParams`, `readValidatedBody` и т.п.; невалидный ввод даёт 400 без деталей схемы), секреты только в приватном `runtimeConfig` через `NUXT_*`, персональные страницы и API не кэшируются через `routeRules`.

## Процесс разработки
Работа идёт шагами. На каждом шаге:
1. Сначала тесты (red), затем реализация (green). Тесты на логику и поведение (схемы, API, правила линтера, интерактив), а не на косметику: не фиксировать точные цвета и размеры.
2. `pnpm typecheck`, `pnpm lint`, `pnpm lint:style`, `pnpm test`.
3. Ревью: скилл `nuxt-review` и `/code-review`. Для авторизации и безопасности дополнительно `security-guidance`.
4. Обновление `.claude/project-state.md`.
5. Остановка и ожидание «ок» пользователя. Коммит и пуш только после «ок».

Визуальные проверки в браузере (скриншоты, просмотр страниц) только после согласования с пользователем: он может посмотреть сам. Автоматические проверки запускаются всегда.

## Контент
- Пункт грамматики: `id` (неизменяемый), `level` (n5…n1), `register` (neutral | polite | casual | slang | written), `title`, `summary`, `formation`, `explanation` (ru), `examples` (4–6, минимум один диалог), `pitfalls`, `related`, `prerequisites`, `exercises`, `status` (draft | reviewed).
- Фуригана в разметке `{漢字|かんじ}` (чтение только из каны), показывается компонентом `<UiRuby>`, включается и выключается в настройках.
- Упражнения лежат в том же YAML, что и пункт (ключ `exercises`, минимум 4). Типы: `choice` (`prompt`, `options`, `answerIndex`), `cloze` (`text` с пропусками `{{ответ|вариант2}}`, `translation`), `reorder` (`words` в правильном порядке, `translation`), `translate` (`prompt`, `answers` со списком допустимых ответов). Диалоги в `dialogues` (минимум один).
- Проверка контента: `pnpm validate:content` (схема, уникальность id, имя файла = id, папка = уровень, ссылки `related`/`prerequisites`, отсутствие циклов).
- Лексика примеров не выше уровня пункта. Тексты Тае Кима, Первовой и Genki не копируются, они только ориентир по темам.
- Трек `casual`: разговорная и редкая грамматика с пометками, кому и когда это можно говорить.

## SRS
FSRS (ts-fsrs). Единица повторения — пункт грамматики, упражнения берутся из пула пункта. Оценка за урок: без ошибок и подсказок = Good, 1 ошибка или подсказка = Hard, 2+ ошибок = Again. `review_state` и `review_log` пишутся в одной транзакции.
