import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Group as GroupIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

const Groups = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = db
      .collection('groups')
      .where('storeId', '==', user?.storeId)
      .onSnapshot((snapshot) => {
        const groupsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGroups(groupsData);
      });

    return unsubscribe;
  }, [user?.storeId]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    setLoading(true);
    try {
      await db.collection('groups').add({
        name: groupName,
        storeId: user.storeId,
        ownerId: user.uid,
        members: [user.uid],
        createdAt: new Date(),
      });
      setGroupName('');
      setOpenDialog(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
    setLoading(false);
  };

  const handleUpdateGroup = async () => {
    if (!groupName.trim() || !selectedGroup) return;

    setLoading(true);
    try {
      await db.collection('groups').doc(selectedGroup.id).update({
        name: groupName,
      });
      setGroupName('');
      setSelectedGroup(null);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating group:', error);
    }
    setLoading(false);
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;

    try {
      await db.collection('groups').doc(groupId).delete();
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Groups</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedGroup(null);
            setGroupName('');
            setOpenDialog(true);
          }}
        >
          Create Group
        </Button>
      </Box>

      <Grid container spacing={3}>
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <GroupIcon
                      sx={{
                        fontSize: 40,
                        color: theme.palette.primary.main,
                        mr: 2,
                      }}
                    />
                    <Typography variant="h6">{group.name}</Typography>
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() => {
                        setSelectedGroup(group);
                        setGroupName(group.name);
                        setOpenDialog(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteGroup(group.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="text.secondary">
                  {group.members.length} members
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created {new Date(group.createdAt?.toDate()).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedGroup ? 'Edit Group' : 'Create New Group'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={selectedGroup ? handleUpdateGroup : handleCreateGroup}
            variant="contained"
            disabled={loading || !groupName.trim()}
          >
            {selectedGroup ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Groups; 