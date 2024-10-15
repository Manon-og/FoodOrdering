// import React, { forwardRef } from 'react';
// import { Modal, View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
// import QuantityListItem from '@/src/components/QuantityListItem';

// const QuantityModal = forwardRef(({ visible, onClose, batch }, ref) => {
//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={visible}
//       onRequestClose={onClose}
//     >
//       <View style={styles.centeredView}>
//         <View style={styles.modalView} ref={ref}>
//           <Text style={styles.modalText}>Batch Details</Text>
//           <FlatList
//             data={batch}
//             keyExtractor={(item) => item.id_batch.toString()}
//             renderItem={({ item }) => <QuantityListItem batch={item} />}
//           />
//           <Pressable
//             style={[styles.button, styles.buttonClose]}
//             onPress={onClose}
//           >
//             <Text style={styles.textStyle}>Close</Text>
//           </Pressable>
//         </View>
//       </View>
//     </Modal>
//   );
// });

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   button: {
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//   },
//   buttonClose: {
//     backgroundColor: '#2196F3',
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
// });

// export default QuantityModal;