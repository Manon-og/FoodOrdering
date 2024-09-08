// import { View, Text, Button } from 'react-native';
// import React, { useEffect, useState, useCallback } from 'react';
// import { supabase } from '../../lib/supabase';

// const ProfileScreen = () => {
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   const handleLogout = useCallback(() => {
//     setIsLoggingOut(true);
//   }, []);

//   useEffect(() => {
//     if (isLoggingOut) {
//       supabase.auth.signOut().then(() => {
//         // Handle successful logout
//         console.log('Logged out successfully');
//         setIsLoggingOut(false);
//       }).catch(error => {
//         // Handle logout error
//         console.error('Logout error:', error);
//         setIsLoggingOut(false);
//       });
//     }
//   }, [isLoggingOut]);

//   return (
//     <View>
//       <Button
//         onPress={handleLogout}
//         title="Sign out"
//         disabled={isLoggingOut}
//       />
//     </View>
//   );
// };

// export default ProfileScreen;