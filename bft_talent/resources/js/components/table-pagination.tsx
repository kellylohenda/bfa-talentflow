import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    links: PaginationLink[];
    filters?: Record<string, string | undefined>;
};

export function TablePagination({ links, filters = {} }: Props) {
    if (links.length <= 3) return null;

    const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));

    return (
        <div className="flex flex-wrap justify-center gap-1">
            {links.map((link, i) => (
                <Button
                    key={i}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url, cleanFilters)}
                >
                    {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                </Button>
            ))}
        </div>
    );
}
