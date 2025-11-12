// src/app/core/icons.ts
import { addIcons } from 'ionicons';
import { 
    add, addCircle, addCircleOutline, addOutline,
    checkmarkOutline, chevronDownCircleOutline,
    chevronUpCircleOutline, documentTextOutline,
    eyeOutline, gitBranchOutline, homeOutline,
    lockClosedOutline, logOutOutline, mailOutline,
    options, pencilOutline, peopleOutline, trash, trashOutline
} from 'ionicons/icons';

export function registerGlobalIcons() {
    addIcons({
        add, addCircle, addCircleOutline, addOutline,
        checkmarkOutline, chevronDownCircleOutline,
        chevronUpCircleOutline, documentTextOutline,
        eyeOutline, gitBranchOutline, homeOutline,
        lockClosedOutline, logOutOutline, mailOutline,
        options, pencilOutline, peopleOutline, trash, trashOutline
    });
}
