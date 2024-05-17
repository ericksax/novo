import { Toast } from '@capacitor/toast';

export async function presentToast(
  text: string,
  duration: "short" | "long" | undefined,
  position: "top" | "center" | "bottom" | undefined
) {
  await Toast.show({
    text,
    duration,
    position,
  });
}

