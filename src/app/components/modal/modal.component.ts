import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { DocumentService } from '../../services/document.service'
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError } from 'rxjs';
import { Platform } from '@ionic/angular';
import { presentToast } from 'src/app/helpers/toast';
import { ToastController } from '@ionic/angular'
import {
  IonModal,
  IonHeader,
  IonList,
  IonImg,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenuButton,
  IonMenu,
  IonButton,
  IonButtons,
  IonItem,
  IonIcon,
  IonCard,
  IonCardContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonThumbnail
} from '@ionic/angular/standalone'
const IMAGE_DIR = 'stored-images';

interface LocalFile {
	name: string;
	path: string;
	data: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonThumbnail,
    IonModal,
    IonImg,
    IonHeader,
    IonList,
    IonButton,
    IonContent,
    IonToolbar,
    IonTitle,
    IonMenuButton,
    IonMenu,
    IonButtons,
    IonItem,
    IonIcon,
    IonCard,
    IonCardContent,
    IonInput,
    IonSelect,
    IonSelectOption]
})
export class ModalComponent  implements OnInit {
  formSendPhoto! : FormGroup;
  @Input() documentId!: string
  imageUrl!: string;
  imagePath: any;
  @ViewChild(IonModal) modal!: IonModal;
  images: LocalFile[] = [];
  formData!: FormData;
  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';

  @Output() update = new EventEmitter<string>();

  notifyParent() {
    this.update.emit();
  }

  constructor(
    private documentService: DocumentService,
    private plt: Platform,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    this.formSendPhoto = new FormGroup({
      name: new FormControl('', [Validators.required]),
      document: new FormControl('', [Validators.required]),
      photo: new FormControl('', [Validators.required]),
    })

    this.loadFiles();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(null,
      'confirm');
    }

    async submit($event: Event) {
      $event.preventDefault()
      const response = await fetch(this.images[0].data);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('recebedor_nome', this.formSendPhoto.value.name);
      formData.append('recebedor_documento', this.formSendPhoto.value.document);
      formData.append('file', blob, this.images[0].name);
      this.uploadData(formData)
    }

    async uploadData(formData: FormData) {

      this.documentService.updateDocument(formData, this.documentId).pipe(
        catchError(error => {
          if(error.status === 400) {
            presentToast(this.toastController, 'top', '', 'danger')
          }
          console.error(error)
          throw new Error('Ocorreu um erro')
        })
      ).subscribe(
        resut =>  {
          console.log(resut)
          this.notifyParent()
        },
      )
      this.cancel()
    }

  takePicture = async () => {
    await this.deletarArquivosFilesystem()

    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      promptLabelPicture: 'Tirar foto',
      promptLabelPhoto: 'Carregar imagem',
      promptLabelCancel: 'Cancelar',
      promptLabelHeader: 'Selecione uma opção',
      presentationStyle: 'popover',
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)


    if(image ) {
      this.imageUrl = image.webPath!;
      this.saveImage(image)
    }
    // Can be set to the src of an image now
  };

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpeg';

    const savedFile = await Filesystem.writeFile({
        path: `${IMAGE_DIR}/${fileName}`,
        data: base64Data,
        directory: Directory.Data
    });

    this.loadFiles();
    // Reload the file list
    // Improve by only loading for the new image and unshifting array!
  }

  async loadFiles() {
    this.images = [];

		Filesystem.readdir({
			path: IMAGE_DIR,
			directory: Directory.Data
		})
			.then(
				(result) => {
          this.loadFileData(result.files.map((x) => x.name));
				},
				async (err) => {
          console.log('here: inside Error Load Files')
					// Folder does not yet exists!
					await Filesystem.mkdir({
						path: IMAGE_DIR,
						directory: Directory.Data
					});
				}
			)
			.then((_) => {

			});
	}

  async loadFileData(fileNames: string[]) {
		for (let f of fileNames) {
			const filePath = `${IMAGE_DIR}/${f}`;

			const readFile = await Filesystem.readFile({
				path: filePath,
				directory: Directory.Data
			});

			this.images.push({
				name: f,
				path: filePath,
				data: `data:image/jpeg;base64,${readFile.data}`
			});
		}
	}

  private async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid')) {
        const file = await Filesystem.readFile({
            path: photo.path || ''
        });

        return file.data;
    }
    else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();

        return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

// Upload the formData to our API

  async deletarArquivosFilesystem() {
    try {
      const listagem = await Filesystem.readdir({
        path: IMAGE_DIR,
        directory: Directory.Data
      });

      if (listagem.files.length === 0) {
        return;
      }

      for (const arquivo of listagem.files) {
        await Filesystem.deleteFile({
          path: `${IMAGE_DIR}/${arquivo.name}`,
          directory: Directory.Data
        });
      }

      console.log('Todos os arquivos foram excluídos com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir arquivos:', error);
    }
  }
}


