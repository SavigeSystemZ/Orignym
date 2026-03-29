import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import React from 'react';

describe('Deep Glass UI Components', () => {
  it('renders a button with premium styling classes', () => {
    render(<Button className="glass-button">Premium Action</Button>);
    const button = screen.getByText('Premium Action');
    expect(button).toBeDefined();
    expect(button.className).toContain('glass-button');
  });

  it('renders a badge with variant styles', () => {
    render(<Badge variant="secondary">Linguistic Match</Badge>);
    const badge = screen.getByText('Linguistic Match');
    expect(badge).toBeDefined();
    expect(badge.className).toContain('bg-secondary');
  });

  it('renders a glass card with backdrop-blur foundation', () => {
    render(
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Linguistic Record</CardTitle>
        </CardHeader>
        <CardContent>
          Provenance data goes here.
        </CardContent>
      </Card>
    );
    const title = screen.getByText('Linguistic Record');
    expect(title).toBeDefined();
    // Verification of computed styles would require actual CSS loading in JSDOM, 
    // but we can verify class presence.
    const card = title.closest('.glass-card');
    expect(card).toBeDefined();
    expect(card?.className).toContain('backdrop-blur-xl');
  });
});
