# Testing Guide for TalkSpace Chat

## How to Test the "New Chat" Functionality

### Prerequisites
1. Make sure you have Firebase configured correctly
2. Ensure Firestore security rules are set up (see README.md)

### Step-by-Step Testing

#### 1. Create Multiple User Accounts
To test the chat functionality, you need at least 2 user accounts:

1. **Open the app in two different browser windows** (or use incognito mode for one)
2. **Sign up with different email addresses** in each window:
   - Window 1: `user1@example.com`
   - Window 2: `user2@example.com`

#### 2. Test the New Chat Feature
1. In Window 1, click the "New Chat" button
2. You should see a dialog with user search
3. The other user (from Window 2) should appear in the list
4. Click on the user to start a chat

#### 3. Debug Information
If the "New Chat" button isn't working, check the browser console for these logs:

- `"Loading users..."` - Should appear when you click "New Chat"
- `"Found X users in database"` - Shows how many users are in Firestore
- `"User data: {...}"` - Shows the data for each user
- `"Filtered users: [...]"` - Shows the final list of available users

#### 4. Common Issues and Solutions

**Issue: "No users available"**
- **Cause**: Only one user account exists in the database
- **Solution**: Create a second account in a different browser window

**Issue: "Failed to load users"**
- **Cause**: Firebase connection or security rules issue
- **Solution**: Check Firebase configuration and security rules

**Issue: "Failed to create chat"**
- **Cause**: Firestore write permissions or network issue
- **Solution**: Check Firestore security rules and internet connection

#### 5. Firestore Security Rules
Make sure your Firestore security rules allow:
- Reading from the `users` collection
- Writing to the `chats` collection
- Writing to the `chats/{chatId}/messages` subcollection

Example rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all user documents (for chat creation)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write chats they participate in
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Users can read/write messages in chats they participate in
    match /chats/{chatId}/messages/{messageId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
    }
  }
}
```

#### 6. Testing Checklist
- [ ] Two different user accounts created
- [ ] "New Chat" button opens dialog
- [ ] Other user appears in the user list
- [ ] Clicking on user creates a chat
- [ ] Messages can be sent and received
- [ ] Real-time updates work

#### 7. Console Debugging
Open browser developer tools (F12) and check the Console tab for:
- Error messages
- Debug logs from the chat functionality
- Firebase connection status

If you're still having issues, please check the console logs and share any error messages.
