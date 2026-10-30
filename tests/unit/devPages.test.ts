import { describe, expect, it } from 'vitest';
import { removeDevOnlyPages } from '../../config/devPages';
import { ROUTE } from '../../shared/routes';

describe('removeDevOnlyPages', () => {
  it('убирает страницы, предназначенные только для dev', () => {
    const pages = [
      { name: ROUTE.home, path: '/' },
      { name: ROUTE.styleguide, path: '/styleguide' },
    ];

    removeDevOnlyPages(pages);

    expect(pages).toEqual([{ name: ROUTE.home, path: '/' }]);
  });

  it('не трогает остальные страницы и безымянные роуты', () => {
    const pages = [{ path: '/' }, { name: ROUTE.home, path: '/home' }];

    removeDevOnlyPages(pages);

    expect(pages).toHaveLength(2);
  });
});
