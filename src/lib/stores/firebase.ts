import { initializeApp } from "firebase/app";
import { doc, getCountFromServer, getDoc, getDocs, getFirestore, limit, orderBy, query, updateDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { type ScoreObjectType } from "./score.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdYuYOMOXxPbngX0n7qCFBLZqLruF3Y9g",
  authDomain: "shade-seeker-8dab8.firebaseapp.com",
  projectId: "shade-seeker-8dab8",
  storageBucket: "shade-seeker-8dab8.firebasestorage.app",
  messagingSenderId: "863106903447",
  appId: "1:863106903447:web:505ac37bc66ebcee83a8d2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export type Player = {
	id?: string;
	nickname: string;
	score: number;
	timestamp: Date;
}

export async function addPlayer(nickname: string, score: number) {
  try {
    const newDoc = await addDoc(collection(db, "players"), {
		nickname: nickname,
		score: score,
		timestamp: new Date()
    } as Player);

	return newDoc.id;
  } catch (error) {
    console.error("Error saving score: ", error);
  }
}

export async function getTopPlayers(playerId: string): Promise<Player[]> {
	const q = query(
		collection(db, "players"),
		orderBy("score", "desc"),
		limit(10)
	);
  
	const snapshot = await getDocs(q);
	let players = snapshot.empty ? [] : snapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data() as Player
	}));

	if (players?.find(player => player.id === playerId) === undefined) {
		const docRef = doc(db, "players", playerId);
		const docSnap = await getDoc(docRef);
	
		if (docSnap.exists()) {
			players = [...players, {
				id: docSnap.id,
				...docSnap.data() as Player
			}]
		}
	}

	return players;
}


export async function getLastPlayer(): Promise<Player | null> {
	const q = query(
		collection(db, "players"),
		orderBy("timestamp", "desc"),
		limit(1)
	);
  
	const snapshot = await getDocs(q);
	return snapshot.empty ? null : {
		id: snapshot.docs[0].id,
		...snapshot.docs[0].data() as Omit<Player, 'id'>
	};
}

export async function getPlayersQty(): Promise<number> {
	const q = collection(db, "players");
	const snapshot = await getCountFromServer(q);
	return snapshot.data().count;
}

export async function updatePlayersScore(userId: string | void, maxScore: ScoreObjectType) {
	const ref = doc(db, "players", userId as string);
	await updateDoc(ref, {
		score: maxScore.thirdWheel + maxScore.shadeOrder
	});
}

export async function changePlayersName(userId: string | void, newName: string) {
	const ref = doc(db, "players", userId as string);
	await updateDoc(ref, {
		nickname: newName
	});
}