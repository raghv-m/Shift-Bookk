import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, IconButton, Avatar, 
  List, ListItem, ListItemAvatar, ListItemText, Divider, InputAdornment 
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Search as SearchIcon
} from '@mui/icons-material';

interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  text: string;
  timestamp: string;
  read: boolean;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastMessage?: string;
  unreadCount?: number;
  lastActive?: string;
}

const Messages: React.FC = () => {
  const theme = useTheme();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data for contacts
  const contacts: Contact[] = [
    {
      id: 1,
      name: 'Sarah Williams',
      avatar: 'S',
      status: 'online',
      lastMessage: 'Can you cover my shift tomorrow?',
      unreadCount: 2,
      lastActive: 'Just now'
    },
    {
      id: 2,
      name: 'Mike Johnson',
      avatar: 'M',
      status: 'offline',
      lastMessage: 'Thanks for the help yesterday!',
      lastActive: '2 hours ago'
    },
    {
      id: 3,
      name: 'Emily Chen',
      avatar: 'E',
      status: 'away',
      lastMessage: 'I sent you the updated schedule.',
      lastActive: '1 day ago'
    },
    {
      id: 4,
      name: 'Team Announcement',
      avatar: 'T',
      status: 'online',
      lastMessage: 'New company policy on shift scheduling.',
      unreadCount: 1,
      lastActive: '3 days ago'
    }
  ];

  // Sample messages for the selected conversation
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: 1,
      recipientId: 0, // current user
      text: 'Hey, are you available to cover my shift tomorrow morning? I have a doctor\'s appointment.',
      timestamp: '10:30 AM',
      read: true
    },
    {
      id: 2,
      senderId: 0, // current user
      recipientId: 1,
      text: 'What time is the shift?',
      timestamp: '10:35 AM',
      read: true
    },
    {
      id: 3,
      senderId: 1,
      recipientId: 0,
      text: 'It\'s from 8 AM to 2 PM. I know it\'s early, but I really need the help.',
      timestamp: '10:36 AM',
      read: true
    },
    {
      id: 4,
      senderId: 0,
      recipientId: 1,
      text: 'Let me check my schedule. I think I can do it.',
      timestamp: '10:40 AM',
      read: true
    },
    {
      id: 5,
      senderId: 1,
      recipientId: 0,
      text: 'That would be really great! Thank you so much!',
      timestamp: '10:41 AM',
      read: true
    },
    {
      id: 6,
      senderId: 1,
      recipientId: 0,
      text: 'I just checked with the manager and they approved the swap. Can you confirm it works for you?',
      timestamp: '11:15 AM',
      read: false
    },
    {
      id: 7,
      senderId: 1,
      recipientId: 0,
      text: 'I\'ll owe you one! Let me know if you need anything in the future. 😊',
      timestamp: '11:16 AM',
      read: false
    }
  ]);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim() && selectedContact) {
      const newMessage: Message = {
        id: messages.length + 1,
        senderId: 0, // current user
        recipientId: selectedContact.id,
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      };
      
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Messages
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Chat with your team members
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ height: 'calc(80vh - 100px)' }}>
        {/* Contacts sidebar */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: alpha(theme.palette.background.paper, 0.7),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Box p={2}>
              <TextField
                fullWidth
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.background.default, 0.6)
                  }
                }}
              />
            </Box>
            
            <Divider />
            
            <List sx={{ overflow: 'auto', flexGrow: 1, py: 0 }}>
              {filteredContacts.map((contact) => (
                <React.Fragment key={contact.id}>
                  <ListItem
                    button
                    selected={selectedContact?.id === contact.id}
                    onClick={() => setSelectedContact(contact)}
                    sx={{
                      px: 2,
                      py: 1.5,
                      transition: 'all 0.2s',
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.15)
                        }
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Box position="relative">
                        <Avatar
                          sx={{
                            bgcolor: contact.status === 'online'
                              ? alpha(theme.palette.success.main, 0.2)
                              : contact.status === 'away'
                                ? alpha(theme.palette.warning.main, 0.2)
                                : alpha(theme.palette.grey[500], 0.2),
                            color: contact.status === 'online'
                              ? theme.palette.success.main
                              : contact.status === 'away'
                                ? theme.palette.warning.main
                                : theme.palette.grey[500]
                          }}
                        >
                          {contact.avatar}
                        </Avatar>
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: contact.status === 'online'
                              ? theme.palette.success.main
                              : contact.status === 'away'
                                ? theme.palette.warning.main
                                : theme.palette.grey[500],
                            border: `2px solid ${theme.palette.background.paper}`
                          }}
                        />
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2" fontWeight="medium">
                            {contact.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {contact.lastActive}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              maxWidth: '180px'
                            }}
                          >
                            {contact.lastMessage}
                          </Typography>
                          {contact.unreadCount && (
                            <Box
                              sx={{
                                minWidth: 20,
                                height: 20,
                                borderRadius: 10,
                                bgcolor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                ml: 1
                              }}
                            >
                              {contact.unreadCount}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider component="li" variant="inset" />
                </React.Fragment>
              ))}
              {filteredContacts.length === 0 && (
                <Box p={4} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    No contacts found
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>
        
        {/* Conversation area */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              height: '100%',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              background: alpha(theme.palette.background.paper, 0.7),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            {selectedContact ? (
              <>
                {/* Conversation header */}
                <Box
                  display="flex"
                  alignItems="center"
                  p={2}
                  borderBottom={`1px solid ${alpha(theme.palette.divider, 0.1)}`}
                >
                  <Box position="relative" mr={2}>
                    <Avatar
                      sx={{
                        bgcolor: selectedContact.status === 'online'
                          ? alpha(theme.palette.success.main, 0.2)
                          : selectedContact.status === 'away'
                            ? alpha(theme.palette.warning.main, 0.2)
                            : alpha(theme.palette.grey[500], 0.2),
                        color: selectedContact.status === 'online'
                          ? theme.palette.success.main
                          : selectedContact.status === 'away'
                            ? theme.palette.warning.main
                            : theme.palette.grey[500]
                      }}
                    >
                      {selectedContact.avatar}
                    </Avatar>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: selectedContact.status === 'online'
                          ? theme.palette.success.main
                          : selectedContact.status === 'away'
                            ? theme.palette.warning.main
                            : theme.palette.grey[500],
                        border: `2px solid ${theme.palette.background.paper}`
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {selectedContact.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedContact.status === 'online'
                        ? 'Online'
                        : selectedContact.status === 'away'
                          ? 'Away'
                          : `Last active ${selectedContact.lastActive}`}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Message area */}
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      alignSelf={message.senderId === 0 ? 'flex-end' : 'flex-start'}
                      sx={{
                        maxWidth: '70%',
                        mb: 1.5,
                        position: 'relative'
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: message.senderId === 0
                            ? alpha(theme.palette.primary.main, 0.1)
                            : alpha(theme.palette.grey[100], theme.palette.mode === 'dark' ? 0.1 : 0.7),
                          color: message.senderId === 0
                            ? theme.palette.primary.dark
                            : theme.palette.text.primary,
                          boxShadow: theme.shadows[1]
                        }}
                      >
                        <Typography variant="body2">
                          {message.text}
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent={message.senderId === 0 ? 'flex-end' : 'flex-start'}
                        mt={0.5}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {message.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                
                {/* Message input */}
                <Box
                  p={2}
                  borderTop={`1px solid ${alpha(theme.palette.divider, 0.1)}`}
                >
                  <TextField
                    fullWidth
                    multiline
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    maxRows={4}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton size="small">
                            <AttachFileIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <EmojiIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            color="primary" 
                            onClick={handleSendMessage}
                            disabled={!messageText.trim()}
                          >
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                        backgroundColor: alpha(theme.palette.background.default, 0.6)
                      }
                    }}
                  />
                </Box>
              </>
            ) : (
              // Placeholder when no conversation is selected
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                p={4}
              >
                <SendIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.2), mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No conversation selected
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Select a contact from the list to start chatting
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Messages; 