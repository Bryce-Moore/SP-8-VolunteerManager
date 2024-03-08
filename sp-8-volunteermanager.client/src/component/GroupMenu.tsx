interface Group {
  id: string;
  name: string;
}

interface GroupMenuProps {
  onSelectGroup: (groupID: string) => void;
  groups: Group[];
}

const GroupMenu: React.FC<GroupMenuProps> = ({ groups, onSelectGroup }) => {
  return (
    <div>
      {/* Map each group to a button */}
      {/* Selecting group updates state in App.tsx and Dashboard.tsx via prop function */}
      {groups.map(group => ( 
        <div key={group.id} onClick={() => onSelectGroup(group.id)} style={{ cursor: 'pointer', padding: '10px', margin: '5px', border: '1px solid #ccc', borderRadius: '5px' }}>
          {group.name}
        </div>
      ))}
    </div>
  );
};

export default GroupMenu;