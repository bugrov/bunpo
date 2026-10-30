import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import { UiBadge, UiButton, UiCard, UiField, UiInput, UiLabel, UiRuby } from '#components';
import { useFurigana } from '~/composables/useFurigana';

describe('UiButton', () => {
  it('рендерит слот и по умолчанию primary / md / type=button', async () => {
    const wrapper = await mountSuspended(UiButton, { slots: { default: 'Начать' } });
    const button = wrapper.get('button');

    expect(button.text()).toBe('Начать');
    expect(button.classes()).toEqual(expect.arrayContaining(['ui-button', 'ui-button--primary', 'ui-button--md']));
    expect(button.attributes('type')).toBe('button');
  });

  it('применяет вариант и размер как BEM-модификаторы', async () => {
    const wrapper = await mountSuspended(UiButton, { props: { variant: 'danger', size: 'lg' } });

    expect(wrapper.get('button').classes()).toEqual(expect.arrayContaining(['ui-button--danger', 'ui-button--lg']));
  });

  it('поддерживает disabled', async () => {
    const wrapper = await mountSuspended(UiButton, { props: { disabled: true } });

    expect(wrapper.get('button').attributes('disabled')).toBeDefined();
  });
});

describe('UiInput', () => {
  it('обновляет v-model', async () => {
    const wrapper = await mountSuspended(UiInput, { props: { modelValue: '' } });

    await wrapper.get('input').setValue('たべる');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['たべる']);
  });

  it('пробрасывает атрибуты на input и помечает ошибку', async () => {
    const wrapper = await mountSuspended(UiInput, {
      props: { invalid: true },
      attrs: { id: 'email', placeholder: 'Email' },
    });
    const input = wrapper.get('input');

    expect(input.attributes('id')).toBe('email');
    expect(input.attributes('placeholder')).toBe('Email');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.classes()).toContain('ui-input--invalid');
  });
});

describe('UiLabel', () => {
  it('рендерит label с атрибутом for', async () => {
    const wrapper = await mountSuspended(UiLabel, { attrs: { for: 'x' }, slots: { default: 'Имя' } });

    expect(wrapper.get('label').attributes('for')).toBe('x');
    expect(wrapper.text()).toBe('Имя');
  });
});

describe('UiField', () => {
  it('связывает label и поле через id', async () => {
    const wrapper = await mountSuspended(UiField, {
      props: { label: 'Email' },
      slots: { default: '<template #default="{ id }"><input :id="id" /></template>' },
    });
    const labelFor = wrapper.get('label').attributes('for');

    expect(labelFor).toBeTruthy();
    expect(wrapper.get('input').attributes('id')).toBe(labelFor);
  });

  it('показывает подсказку, а при ошибке только ошибку с role=alert', async () => {
    const withHint = await mountSuspended(UiField, { props: { label: 'A', hint: 'Подсказка' } });

    expect(withHint.text()).toContain('Подсказка');

    const withError = await mountSuspended(UiField, { props: { label: 'A', hint: 'Подсказка', error: 'Ошибка' } });

    expect(withError.text()).not.toContain('Подсказка');
    expect(withError.get('[role="alert"]').text()).toBe('Ошибка');
  });

  it('передаёт в слот invalid и describedBy', async () => {
    const wrapper = await mountSuspended(UiField, {
      props: { label: 'A', error: 'Ошибка' },
      slots: {
        default:
          '<template #default="{ invalid, describedBy }"><i :data-invalid="invalid" :data-by="describedBy" /></template>',
      },
    });
    const marker = wrapper.get('i');

    expect(marker.attributes('data-invalid')).toBe('true');
    expect(marker.attributes('data-by')).toMatch(/-error$/);
  });
});

describe('UiCard', () => {
  it('рендерит секции header и footer только когда они переданы', async () => {
    const plain = await mountSuspended(UiCard, { slots: { default: 'Тело' } });

    expect(plain.find('.ui-card__header').exists()).toBe(false);
    expect(plain.find('.ui-card__footer').exists()).toBe(false);
    expect(plain.get('.ui-card__body').text()).toBe('Тело');

    const full = await mountSuspended(UiCard, { slots: { default: 'Тело', header: 'Шапка', footer: 'Низ' } });

    expect(full.get('.ui-card__header').text()).toBe('Шапка');
    expect(full.get('.ui-card__footer').text()).toBe('Низ');
  });
});

describe('UiRuby', () => {
  const text = 'わたしは{学生|がくせい}です。';

  it('показывает чтения над кандзи, когда фуригана включена', async () => {
    useFurigana().value = true;
    const wrapper = await mountSuspended(UiRuby, { props: { text } });

    expect(wrapper.attributes('lang')).toBe('ja');
    expect(wrapper.get('ruby').text()).toContain('学生');
    expect(wrapper.get('rt').text()).toBe('がくせい');
    expect(wrapper.findAll('rp').map((rp) => rp.text())).toEqual(['(', ')']);
    expect(wrapper.text()).toContain('わたしは');
  });

  it('скрывает чтения, когда фуригана выключена, и оставляет текст', async () => {
    useFurigana().value = false;
    const wrapper = await mountSuspended(UiRuby, { props: { text } });

    expect(wrapper.find('rt').exists()).toBe(false);
    expect(wrapper.text()).toBe('わたしは学生です。');
  });
});

describe('UiBadge', () => {
  it('применяет вариант как BEM-модификатор', async () => {
    const wrapper = await mountSuspended(UiBadge, { props: { variant: 'accent' }, slots: { default: 'N5' } });

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['ui-badge', 'ui-badge--accent']));
    expect(wrapper.text()).toBe('N5');
  });
});
