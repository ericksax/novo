import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { DocumentService } from '../../services/document.service'
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError } from 'rxjs';
import { Platform } from '@ionic/angular';
import { presentToast } from 'src/app/helpers/toast';
import { EventService } from 'src/app/services/event.service';
import { CommonModule } from '@angular/common';
import {
  IonModal,
  IonHeader,
  IonList,
  IonImg,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenuButton,
  IonCardTitle,
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
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    CommonModule]
})
export class ModalComponent  implements OnInit, AfterViewInit {
  @ViewChild('inputName', { static: false }) inputName!: IonInput;
  @ViewChild(IonModal) modal!: IonModal;
  @Input() documentId!: string
  formSendPhoto! : FormGroup;
  imageUrl!: string;
  imagePath: any;
  images: LocalFile[] = [];
  formData!: FormData;

  constructor(
    private documentService: DocumentService,
    private plt: Platform,
    private eventService: EventService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(()=> {
      this.inputName?.setFocus();
    }, 2500)
  }

  async ngOnInit() {
    this.formSendPhoto = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      document: new FormControl('', [Validators.required, Validators.minLength(6)]),
      documentType: new FormControl('', [Validators.required]),
    })

    this.loadFiles();

    setTimeout(() => {
      const myDiv = document.getElementById('gost-warning');
      if (myDiv) {
        myDiv.classList.add('hidden');
      }
    }, 3000); //
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
      formData.append('tipo_documento', this.formSendPhoto.value.documentType);
      formData.append('id', this.documentId);
      formData.append('file', blob, this.images[0].name);
      this.uploadData(formData)
    }

    async uploadData(formData: FormData) {

      this.documentService.updateDocument(formData).pipe(
        catchError(error => {
          if(error.status === 400) {
            presentToast('Não foi possível atualizar o documento', 'short','top')
          }
          console.error(error)
          throw new Error('Ocorreu um erro')
        })
      ).subscribe(
        result =>  {
          this.eventService.emitDocumentUpdate(result);
          presentToast('Documento atualizado com sucesso', 'short','top')
        },
      )
      this.confirm()
    }

  takePicture = async () => {
    await this.deletarArquivosFilesystem()

    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      promptLabelPicture: 'Tirar foto',
      promptLabelPhoto: 'Carregar imagem',
      promptLabelCancel: 'Cancelar',
      promptLabelHeader: 'Selecione uma opção',
      presentationStyle: 'popover',
    });

    if(image ) {
      this.imageUrl = image.webPath!;
      this.saveImage(image)
    }
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
// Deleta os arquivos do filesystem para que fique somente uma imagem

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
    } catch (error) {
      console.error('Erro ao excluir arquivos:', error);
    }
  }
}


