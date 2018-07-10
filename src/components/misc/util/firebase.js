import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyCK84FzCjzYFkxae6LbY5QIBD42HPH4xR8',
  authDomain: 'uport-live.firebaseapp.com',
  databaseURL: 'https://uport-live.firebaseio.com/',
}

export const firebaseApp = firebase.initializeApp(config)

function incrementField(field) {
	const db = firebaseApp.database().ref('/')
	db.once('value', (snapshot) => {
		const data = snapshot.val()
		data[field] += 1
		db.set(data)
	})
}

export const incrementCheckins = () => incrementField('badgesCollected')
export const incrementEvents = () => incrementField('eventsCreated')