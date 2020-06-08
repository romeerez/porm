import {model} from './src/porm'
import {Adapter} from 'pg-adapter'

const db = Adapter.fromURL('postgres://dev:@localhost:5432/porm')

interface ProfileInterface {
  id: number
}

const Profile = model<ProfileInterface>(db, 'profiles', {
  // relations: {
  //   user: {
  //     hasMany: () => User
  //   }
  // }
})

interface UserInterface {
  id: number
  name: string
}

const User = model<UserInterface>(db, 'users', {
  // relations: {
  //   profile: {
  //     belongsTo: () => Profile
  //   }
  // },
  // prepared: () => ({
  //   preparedQuery: {
  //     args: ['string'],
  //     query: User.where('name = $1')
  //   }
  // }),
  // scopes: {
  //   active: (users) => users.where({active: true})
  // }
})

const main = async () => {
  const user = await User.take()
  console.log(user.id, user.koko)
}
main()
