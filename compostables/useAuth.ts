import { 
    getAuth, 
    setPersistence, 
    signInWithEmailAndPassword, 
    browserLocalPersistence,
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    type IdTokenResult 
} from "firebase/auth"
import useFirebase from "./useFirebase"
import useAuthValidator from "./useAuthValidator"

export default function useAuth() {
  const user = useState("userStore", () => ({}))
  const errorBag = ref({
    email: null,
    password: null,
    name: null,
  })
  const app = useFirebase()

  const auth = getAuth(app)

  function login(email: string, password: string) {

    resetErrors()
    const validatedData = useAuthValidator( email, password, "login")
   
    if(!validatedData.flag){
        // errorBag.value = validatedData
        return
    }
    setPersistence(auth, browserLocalPersistence).then(() => {
      signInWithEmailAndPassword(auth, email, password).then((userDetails) => {
        user.value = userDetails.user
        userDetails.user.getIdToken().then((token: any) => {
          serverAuth(token)
        })
      })
    })
  }

  function logout() {
    auth.signOut().then(() => {})
  }

  const signUp = async (email: string, password: string): Promise<any> => {
    resetErrors()
    const validatedData = useAuthValidator(email, password, "signup")
    if(!validatedData.flag){
        console.log(validatedData)
        // errorBag.value = validatedData
        return new Promise<any>((resolve) => {
            resolve({ success: false, error: 'Email or password is not a vaild format' })
        })
    }
    return await setPersistence(auth, browserLocalPersistence).then(async () => {
      return await createUserWithEmailAndPassword(auth, email, password).then((userDetails) => {
        user.value = userDetails.user
        userDetails.user.getIdToken().then((token: any) => {
            serverAuth(token)
        })
        return { success: false }
      }).catch(error => {
        return { success: false, error: error.code }
      })
    })

  }

  function resetErrors(){
    errorBag.value = {
        email: null,
        password: null,
        name: null,
    }
  }

  function serverAuth(token: IdTokenResult){
    console.log(token)
    // $fetch("api/login", {
    //     method: "POST",
    //     body: JSON.stringify({token})
    // }).then((res: any) => {
    //     if(res.statusCode == 200){
    //         navigateTo("/dashboard")
    //     }
    // }).catch(err =>{
    //     alert("Invalid creds.....")
    // })
  }

  onAuthStateChanged(auth, (userDetails) => {
    if(userDetails){
        user.value = userDetails
    }
    
  })

  return { user, login, signUp, logout, errorBag }
}