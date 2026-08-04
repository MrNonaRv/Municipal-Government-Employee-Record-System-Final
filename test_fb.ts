import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  try {
    console.log('Testing app_data read...');
    const querySnapshot = await getDocs(collection(firestoreDb, 'app_data'));
    console.log('Success, read', querySnapshot.size, 'docs.');
    
    console.log('Testing system_sync write...');
    await setDoc(doc(firestoreDb, 'system_sync', 'test'), { hello: 'world' });
    console.log('Success write');
    process.exit(0);
  } catch (err) {
    console.error('Firebase test failed:', err);
    process.exit(1);
  }
}
test();
