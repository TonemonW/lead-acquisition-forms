import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';

describe('Button component', () => {
    it('renders with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('inline-flex');
        expect(button).toHaveClass('bg-gradient-to-r');
        expect(button).toHaveAttribute('type', 'button');
    });

    it('applies correct variant classes', () => {
        const { rerender } = render(<Button variant="secondary">Secondary</Button>);
        let button = screen.getByRole('button', { name: /secondary/i });
        expect(button).toHaveClass('border-2');
        expect(button).toHaveClass('text-gray-700');

        rerender(<Button variant="outline">Outline</Button>);
        button = screen.getByRole('button', { name: /outline/i });
        expect(button).toHaveClass('border-gray-200');
        expect(button).toHaveClass('text-gray-800');
    });

    it('appends additional className', () => {
        render(<Button className="custom-class">With Class</Button>);
        const button = screen.getByRole('button', { name: /with class/i });
        expect(button).toHaveClass('custom-class');
    });

    it('handles disabled state correctly', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button', { name: /disabled/i });
        expect(button).toBeDisabled();
        expect(button).toHaveClass('disabled:opacity-50');
    });

    it('supports custom type attribute', () => {
        render(<Button type="submit">Submit</Button>);
        const button = screen.getByRole('button', { name: /submit/i });
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<Button ref={ref}>Ref Button</Button>);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('responds to click events', () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});


