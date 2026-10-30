# Bunpo

Приложение для ежедневного изучения японской грамматики: урок (теория, практика, мини-тест) и интервальные повторения в стиле Anki. Общение с пользователем и тексты интерфейса и контента на русском.

> Этот файл не меняется в ходе разработки. Если нужна правка, сначала спросить пользователя. Текущий статус работы живёт в `.claude/project-state.md`.

## Стек
- Nuxt 4 (Vue 3, TypeScript, Nitro), менеджер пакетов pnpm.
- UI: Tailwind CSS + shadcn-vue (`app/components/ui/`), тёмная тема, палитра Acid Lime, стиль как у higgsfield.ai.
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
    ui/           дизайн-система (Ui*), shadcn-vue под капотом
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
  utils/          клиент БД, SRS, проверки прав
  types/index.ts  серверные типы
shared/
  schemas/        zod-схемы (клиент + сервер)
  types/index.ts  модели и DTO
  routes.ts       имена роутов (as const)
content/grammar/<level>/*.yaml   пункты грамматики
```
FSD-слои внутри `app/components/`, импорты только сверху вниз: pages → widgets → features → entities → ui. Автоимпорт компонентов с `pathPrefix: false`.
Главное требование к структуре: бизнес-сущности и фишки разложены по логичным папкам (`entities/<сущность>/`, `features/<фича>/`), никаких десятков компонентов в одной папке. Если FSD начнёт мешать, его можно упростить, но логичная группировка по папкам остаётся обязательной.

## Принципы
1. Приоритеты при конфликте: корректность и безопасность, затем KISS, затем конвенции Nuxt и стиль кода, затем YAGNI, затем DRY/SOLID.
2. Подробные правила ревью и кода: проектный скилл `.claude/skills/nuxt-review/SKILL.md`. Применяется на каждом шаге.
3. Минимальное изменение под задачу, абстракции только при 2–3 реальных использованиях, новые зависимости с обоснованием.

## Соглашения
- **Типы** только в отдельных файлах, не внутри компонентов, сторов и эндпоинтов. Типы props и локальные типы лежат в `types.ts` рядом с компонентами (в той же папке слайса, например `app/components/features/lesson/types.ts`) и импортируются в компонент. Типы, общие для нескольких мест: `app/types/index.ts`, `shared/types/index.ts`, `server/types/index.ts`. Типы zod через `z.infer`, типы БД через `$inferSelect`/`$inferInsert`.
- **Страницы** тонкие: логика и разметка в `<XxxPage />`.
- **Роуты** именованные: `definePageMeta({ name })`, имена в `shared/routes.ts` (`as const`). Переходы только по имени: `navigateTo({ name })`, `<NuxtLink :to="{ name }">`. Строковые пути запрещены.
- **Стили**: классы по BEM, внутри `@apply` Tailwind (в Tailwind v4 нужен `@reference`). Цвета только через токены темы.
- **UI**: input, button, label, card и т.д. только через компоненты дизайн-системы `Ui*`, без ручной вёрстки каждый раз.
- **БД**: только Drizzle с параметрами. Запрещены `sql.raw` и N+1 (используй `with`/join). Выбирать только нужные колонки. Атомарные операции в транзакции.
- **Код**: TypeScript strict, запрещены `any` и по возможности `as unknown as`. Всегда фигурные скобки у `if`/`else`/циклов, даже для одного оператора. Пустая строка перед `return` (кроме однострочных функций и `return` как единственного оператора блока).
- **Безопасность**: проверка прав на конкретный ресурс на сервере (`where userId = session.user.id`), `requireUserSession` в защищённых эндпоинтах, входные данные только через zod (`readValidatedBody` и т.п.), секреты только в приватном `runtimeConfig` через `NUXT_*`, персональные страницы и API не кэшируются через `routeRules`.

## Процесс разработки
Работа идёт шагами. На каждом шаге:
1. Сначала тесты (red), затем реализация (green).
2. `pnpm typecheck`, `pnpm lint`, `pnpm lint:style`, `pnpm test`.
3. Ревью: скилл `nuxt-review` и `/code-review`. Для авторизации и безопасности дополнительно `security-guidance`.
4. Обновление `.claude/project-state.md`.
5. Остановка и ожидание «ок» пользователя. Коммит и пуш только после «ок».

## Контент
- Пункт грамматики: `id` (неизменяемый), `level` (n5…n1), `register` (neutral | polite | casual | slang | written), `title`, `summary`, `formation`, `explanation` (ru), `examples` (4–6, минимум один диалог), `pitfalls`, `related`, `prerequisites`, `exercises`, `status` (draft | reviewed).
- Фуригана в разметке `{漢字|かんじ}`, показывается компонентом `<Ruby>`, включается и выключается в настройках.
- Лексика примеров не выше уровня пункта. Тексты Тае Кима, Первовой и Genki не копируются, они только ориентир по темам.
- Трек `casual`: разговорная и редкая грамматика с пометками, кому и когда это можно говорить.

## SRS
FSRS (ts-fsrs). Единица повторения — пункт грамматики, упражнения берутся из пула пункта. Оценка за урок: без ошибок и подсказок = Good, 1 ошибка или подсказка = Hard, 2+ ошибок = Again. `review_state` и `review_log` пишутся в одной транзакции.
