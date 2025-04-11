type ViewType = 'week' | 'month' | 'year';

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="view-switcher">
      <button
        className={`view-button ${currentView === 'week' ? 'active' : ''}`}
        onClick={() => onViewChange('week')}
      >
        Week
      </button>
      <button
        className={`view-button ${currentView === 'month' ? 'active' : ''}`}
        onClick={() => onViewChange('month')}
      >
        Month
      </button>
      <button
        className={`view-button ${currentView === 'year' ? 'active' : ''}`}
        onClick={() => onViewChange('year')}
      >
        Year
      </button>
    </div>
  );
}