
export const presentToast = async(
  toastController: any,
  position: 'top' | 'middle' | 'bottom',
  message: string,
  type: 'danger' | 'success')  => {{
    const toast = await toastController.create({
      message: message,
      duration: 1500,
      color: type,
      position: position,
    });

    await toast.present();
  }
}
