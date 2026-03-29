import { test, expect } from '@playwright/test';

test.describe('Orignym Core Workflows', () => {
  test('Landing page renders world-class hero and navigation', async ({ page }) => {
    await page.goto('/');
    
    // Verify high-end branding
    await expect(page.locator('text=ORIGNYM')).toBeVisible();
    await expect(page.locator('text=The Registry of Original Language')).toBeVisible();
    
    // Verify primary navigation
    const getStartedBtn = page.locator('text=Get Started');
    await expect(getStartedBtn).toBeVisible();
  });

  test('Public registry search renders records and filters', async ({ page }) => {
    await page.goto('/registry');
    
    // Verify search interface
    const searchInput = page.getByPlaceholder('Search for terms, domains, or linguistic meanings...');
    await expect(searchInput).toBeVisible();
    
    // Verify "Certified Records" header
    await expect(page.locator('text=Certified Records')).toBeVisible();
  });
});
