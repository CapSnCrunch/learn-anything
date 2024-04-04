import { getApps, initializeApp } from "firebase/app";
import { FirebaseApp } from "@firebase/app-types";

const firebaseConfig = {
  //Put API keys here
};


export default function useFirebase(){
    if(getApps().length == 0){
        const app = initializeApp(firebaseConfig);
        return app as FirebaseApp;
    }
}