import styles from '../styles/GroupMenu.module.css';

interface Group {
  group_id: string;
  name: string;
  role: string;
}

interface GroupMenuProps {
  currentGroup: Group | null;
  onSelectGroup: (id: string, name: string, role: string) => void;
  groups: Group[];
  onCreateGroup: () => void;
  onJoinGroup: () => void;
}

const GroupMenu: React.FC<GroupMenuProps> = ({ currentGroup, groups, onSelectGroup, onCreateGroup, onJoinGroup }) => {
  return (
    <div className={styles.container}>
      {groups.map(group => ( // Lists all the groups with handlers for button clicks
        <div 
          className={styles.selectButton}
          key={group.group_id} 
          onClick={() => onSelectGroup(group.group_id, group.name, group.role)} // Updates the selected group in Dashboard.tsx
          style={{
              backgroundColor: group.group_id === currentGroup?.group_id ? '#006400' : 'transparent',
              color: group.group_id === currentGroup?.group_id ? 'ghostwhite' : '#0a0a0a'
          }}
        >
          {group.name}
        </div>
      ))}
      <div
        onClick={onCreateGroup}
        className={styles.addButton}
      >
        Create a Group
      </div>
      <div
              onClick={onJoinGroup}
              className={styles.joinButton}
      >
        Join a Group
      </div>
    </div>
  );
};

export default GroupMenu;