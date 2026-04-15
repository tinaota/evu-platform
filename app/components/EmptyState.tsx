import { Search, SlidersHorizontal, LifeBuoy } from 'lucide-react';
import type { ReactNode } from 'react';

interface Action {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'ghost';
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actions?: Action[];
}

export default function EmptyState({ icon, title, description, actions }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        {icon ?? <Search className="w-6 h-6 text-neutral-400" />}
      </div>
      <h3 className="text-base font-semibold text-neutral-800 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-xs mb-6">{description}</p>
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={
                action.variant === 'primary'
                  ? 'px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors'
                  : 'px-4 py-2 border border-neutral-200 text-neutral-600 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors'
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Pre-built empty state for search / filter returning no results */
export function NoResultsEmptyState({
  search,
  filterActive,
  onClearSearch,
  onClearFilter,
}: {
  search: string;
  filterActive: boolean;
  onClearSearch: () => void;
  onClearFilter: () => void;
}) {
  const actions: Action[] = [];
  if (search) actions.push({ label: 'Clear search', onClick: onClearSearch, variant: 'primary' });
  if (filterActive) actions.push({ label: 'Remove filter', onClick: onClearFilter });
  actions.push({
    label: 'Contact support',
    onClick: () => window.open('mailto:support@evuplatform.com'),
    variant: 'ghost',
  });

  return (
    <EmptyState
      icon={<SlidersHorizontal className="w-6 h-6 text-neutral-400" />}
      title={search ? `No results for "${search}"` : 'No stations match this filter'}
      description={
        search && filterActive
          ? 'Try clearing the search text or removing the active filter.'
          : search
          ? 'Check the spelling or try a different station name or address.'
          : 'There are no stations with this status right now.'
      }
      actions={actions}
    />
  );
}
