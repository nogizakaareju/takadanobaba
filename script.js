/**
 * TAKADANOBABA SEIKOTSUIN LP Script
 * - Mobile Menu Toggle
 * - FAQ Accordion Control
 */
document.addEventListener('DOMContentLoaded', () => {

  /**
   * イベント計測用のダミー関数
   * @param {string} name - イベント名
   * @param {object} detail - イベント詳細
   */
  const logEvent = (name, detail = {}) => {
    // 実装側でGoogle Analyticsなどに接続してください
    console.debug("EVENT:", name, detail);
  };

  // data-evt属性を持つ要素にクリックイベントを設定
  document.querySelectorAll('[data-evt]').forEach(el => {
    el.addEventListener('click', () => logEvent(el.getAttribute('data-evt')));
  });

  /**
   * モバイルメニューの開閉機能
   */
  const setupMobileMenu = () => {
    const toggleBtn = document.querySelector('.js-menu-toggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggleBtn || !menu) return;

    const openMenu = () => {
      menu.hidden = false;
      document.body.classList.add('menu-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.classList.add('is-active');
      requestAnimationFrame(() => menu.classList.add('is-open'));
      logEvent('menu_open');
    };

    const closeMenu = () => {
      document.body.classList.remove('menu-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.classList.remove('is-active');
      menu.classList.remove('is-open');

      const onTransitionEnd = () => {
        menu.hidden = true;
        menu.removeEventListener('transitionend', onTransitionEnd);
      };
      menu.addEventListener('transitionend', onTransitionEnd);
      // フォールバック
      setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 400);
      logEvent('menu_close');
    };

    toggleBtn.addEventListener('click', () => {
      menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    menu.addEventListener('click', (e) => {
      if (e.target.classList.contains('js-menu-close')) {
        closeMenu();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // 画面幅が広がったら強制的に閉じる
    const mql = window.matchMedia('(min-width: 961px)');
    mql.addEventListener('change', (ev) => {
      if (ev.matches && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  };

  /**
   * FAQアコーディオンの制御機能
   */
  const setupFaqAccordion = () => {
    const faqList = document.getElementById('faqList');
    if (!faqList) return;

    const detailsElements = faqList.querySelectorAll('details');

    detailsElements.forEach(details => {
      const summary = details.querySelector('summary');
      if (summary) {
        summary.addEventListener('click', (e) => {
          e.preventDefault(); // デフォルトの挙動をキャンセル
          const wasOpen = details.open;
          if (wasOpen) {
            details.removeAttribute('open');
          } else {
            details.setAttribute('open', '');
          }
          summary.setAttribute('aria-expanded', !wasOpen);
        });
      }
    });

    const openAllBtn = document.querySelector('.js-faq-open-all');
    const closeAllBtn = document.querySelector('.js-faq-close-all');

    if (openAllBtn) {
      openAllBtn.addEventListener('click', () => {
        detailsElements.forEach(d => {
          d.open = true;
          d.querySelector('summary')?.setAttribute('aria-expanded', 'true');
        });
      });
    }

    if (closeAllBtn) {
      closeAllBtn.addEventListener('click', () => {
        detailsElements.forEach(d => {
          d.open = false;
          d.querySelector('summary')?.setAttribute('aria-expanded', 'false');
        });
      });
    }
  };

  // 各機能を初期化
  setupMobileMenu();
  setupFaqAccordion();

});
