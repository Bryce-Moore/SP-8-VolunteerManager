interface Group {
  id: string;
  name: string;
  role: string;
}

interface GroupMenuProps {
  currentGroup: Group;
  onSelectGroup: (id: string, name: string, role: string) => void;
  groups: Group[];
  onCreateGroup: () => void;
}

const GroupMenu: React.FC<GroupMenuProps> = ({ currentGroup, groups, onSelectGroup, onCreateGroup }) => {
  return (
    <div>
      {groups.map(group => ( // Lists all the groups with handlers for button clicks
        <div 
          key={group.id} 
          onClick={() => onSelectGroup(group.id, group.name, group.role)} // Updates the selected group in Dashboard.tsx
          style={{
            cursor: 'pointer', 
            padding: '10px', 
            margin: '5px', 
            border: '1px solid #ccc', 
            borderRadius: '5px',
            textDecoration: group.id === currentGroup.id ? 'underline' : 'none', // Underlines the currently selected group
          }}
        >
          {group.name}
        </div>
      ))}
      <div
        onClick={onCreateGroup} // Update the state in Dashboard if 'Create a group' is selected
        style={{
          cursor: 'pointer', 
          padding: '10px', 
          margin: '5px', 
          border: '1px solid #ccc', 
          borderRadius: '5px',
        }}
      >
        Create a Group
      </div>
    </div>
  );
};

export default GroupMenu;