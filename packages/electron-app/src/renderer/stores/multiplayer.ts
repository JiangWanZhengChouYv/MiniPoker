import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { io, type Socket } from 'socket.io-client'

interface Player {
  id: string
  name: string
  socketId: string
}

interface Room {
  id: string
  name: string
  players: Player[]
  maxPlayers: number
  gameType: string
  hostId: string
  gameState: any
  isPlaying: boolean
}

export const useMultiplayerStore = defineStore('multiplayer', () => {
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const serverUrl = ref('http://localhost:3000')
  const playerName = ref('玩家')
  const currentRoom = ref<Room | null>(null)
  const availableRooms = ref<Room[]>([])
  const isHost = computed(() => currentRoom.value?.hostId === socket.value?.id)
  const errorMessage = ref('')

  function connect(url: string = serverUrl.value) {
    serverUrl.value = url
    socket.value = io(url, {
      transports: ['websocket', 'polling']
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      errorMessage.value = ''
      console.log('Connected to server')
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('Disconnected from server')
    })

    socket.value.on('error', (msg: string) => {
      errorMessage.value = msg
    })

    socket.value.on('room:joined', (room: Room) => {
      currentRoom.value = room
    })

    socket.value.on('room:left', () => {
      currentRoom.value = null
    })

    socket.value.on('room:list', (rooms: Room[]) => {
      availableRooms.value = rooms
    })

    socket.value.on('room:playerJoined', (player: Player) => {
      if (currentRoom.value) {
        currentRoom.value.players.push(player)
      }
    })

    socket.value.on('room:playerLeft', (playerId: string) => {
      if (currentRoom.value) {
        currentRoom.value.players = currentRoom.value.players.filter(
          (p) => p.id !== playerId
        )
      }
    })

    socket.value.on('game:state', (state: any) => {
      if (currentRoom.value) {
        currentRoom.value.gameState = state
      }
    })

    socket.value.on('game:started', () => {
      if (currentRoom.value) {
        currentRoom.value.isPlaying = true
      }
    })

    socket.value.on('game:action', (action: any) => {
      console.log('Game action received:', action)
    })
  }

  function disconnect() {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
      currentRoom.value = null
    }
  }

  function listRooms(): Promise<Room[]> {
    return new Promise((resolve) => {
      if (!socket.value) return resolve([])
      socket.value.emit('room:list', (rooms: Room[]) => {
        availableRooms.value = rooms
        resolve(rooms)
      })
    })
  }

  function createRoom(
    name: string,
    gameType: string,
    maxPlayers: number
  ): Promise<Room> {
    return new Promise((resolve, reject) => {
      if (!socket.value) return reject(new Error('Not connected'))
      socket.value.emit(
        'room:create',
        { name, gameType, maxPlayers, playerName: playerName.value },
        (room: Room) => {
          currentRoom.value = room
          resolve(room)
        }
      )
    })
  }

  function joinRoom(roomId: string): Promise<Room> {
    return new Promise((resolve, reject) => {
      if (!socket.value) return reject(new Error('Not connected'))
      socket.value.emit(
        'room:join',
        { roomId, playerName: playerName.value },
        (room: Room) => {
          currentRoom.value = room
          resolve(room)
        }
      )
    })
  }

  function leaveRoom() {
    if (socket.value) {
      socket.value.emit('room:leave')
      currentRoom.value = null
    }
  }

  function startGame() {
    if (socket.value) {
      socket.value.emit('game:start')
    }
  }

  function sendGameAction(action: any) {
    if (socket.value) {
      socket.value.emit('game:action', action)
    }
  }

  function setPlayerName(name: string) {
    playerName.value = name
  }

  return {
    socket,
    isConnected,
    serverUrl,
    playerName,
    currentRoom,
    availableRooms,
    isHost,
    errorMessage,
    connect,
    disconnect,
    listRooms,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    sendGameAction,
    setPlayerName
  }
})
