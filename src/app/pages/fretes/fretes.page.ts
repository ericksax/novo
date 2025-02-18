import { Component, computed, OnInit, signal, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonList,
  IonSegmentButton,
  IonSegment,
  IonImg,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonButton,
  IonBadge,
  IonHeader
} from '@ionic/angular/standalone';
import { HeaderComponent} from 'src/app/components/header/header.component'
import { FretesService } from 'src/app/services/fretes.service';

type Fretes = {
  bairro: string;
  cd_cliente: number;
  cidade: string;
  cliente: string;
  cubagem: string;
  distancia: string;
  frete_definido: string;
  n_nota: string;
  peso_bruto: string;
  tipo_dav: string;
  trans_definido: string;
  uf: string;
  volumes: string;
  carro: string;
  carImage: string;
  favorito: boolean
};


@Component({
  selector: 'app-fretes',
  templateUrl: './fretes.page.html',
  styleUrls: ['./fretes.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    CommonModule,
    FormsModule,
    IonButtons,
    IonBackButton,
    IonList,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonSegmentButton,
    IonSegment,
    IonImg,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonButton,
    IonBadge,
    HeaderComponent
  ],
})
export class FretesPage implements OnInit {
  public fretesSignal = signal<Fretes[]>([]);
  public sortCriteriaSignal = signal<string>('');
  public fretes = signal<Fretes[]>([]);
  public states = signal<string[]>([]);
  public state = signal<string>('');
  public countFavorites = 0

  constructor(private fretesService: FretesService) {}

  ngOnInit() {
    this.fretesService
    .getFretes({ versao: 'v-1.2.9' })
    .subscribe((response) => {
      const formattedReponse = this.applingCubageFavoritoAndCarType(response as Fretes[])
      this.fretesSignal.set(formattedReponse);
    });

    this.states.set([
      "TODOS", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES",
      "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR",
      "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
        "SP", "SE", "TO"
      ])
  }


    favoritar(frete: Fretes) {
      this.fretesSignal.update(() => this.fretesSignal().map(currentFrete =>
        currentFrete === frete ? {...currentFrete, favorito: !currentFrete.favorito} : currentFrete
      ))
      this.favoritesCont()
    }

    favoritesCont() {
      this.countFavorites = this.fretesSignal().filter(item => item.favorito).length
    }

    showFavorites() {
      this.setState("TODOS")
      this.sortCriteriaSignal.set("favoritos");
    }



  applingCubageFavoritoAndCarType(fretes: Fretes[]): Fretes[] {
    return fretes.map((frete) => {
      const formattedCubage = parseFloat(frete.cubagem);

      let tipoCarro;
      let imageUrl;

      if (formattedCubage <= 0.2) {
        tipoCarro = 'passeio';
        imageUrl = 'passeio'
      } else if (formattedCubage > 0.2 && formattedCubage <= 3) {
        tipoCarro = 'fiorino';
        imageUrl = 'fiorino'
      } else if (formattedCubage > 3 && formattedCubage <= 10) {
        tipoCarro = 'van';
        imageUrl = 'van'
      } else {
        tipoCarro = 'caminhão';
        imageUrl = 'caminhao'
      }

      return {
        ...frete,
        frete_definido: new Intl.NumberFormat('pt-br',{currency: "BRL", style: "currency" }).format(parseFloat(frete.frete_definido)),
        cubagem: formattedCubage.toFixed(3),
        carro: tipoCarro,
        favorito: false,
        carImage: `assets/${imageUrl}.svg`
      };
    });
  }

  sortedFretes = computed(() => {
    let fretes = [...this.fretesSignal()];
    const criteria = this.sortCriteriaSignal();  // O critério selecionado
    const state = this.state();  // O estado selecionado

    // Se um estado específico for selecionado, filtra os fretes desse estado.
    if (state && state !== "TODOS") {
      fretes = fretes.filter(frete => frete.uf === state);
    }

    // Se o critério for "favoritos", filtra os favoritos após filtrar o estado.
    if (criteria === "favoritos") {
      fretes = fretes.filter(frete => frete.favorito);
    }

    // Agora, aplica a ordenação conforme o critério
    switch (criteria) {
      case "distancia":
        return fretes.sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia));
      case "peso":
        return fretes.sort((a, b) => parseFloat(a.peso_bruto) - parseFloat(b.peso_bruto));
      case "cubagem":
        return fretes.sort((a, b) => parseFloat(a.cubagem) - parseFloat(b.cubagem));
      default:
        return fretes;
    }
  });



  setSortCriteria(criteria: string) {
    this.sortCriteriaSignal.set(criteria);
  }

  setState(state: string) {
    this.state.set(state)
  }

  onChangeStateSelect(ev: any) {
    this.sortCriteriaSignal.set('distancia')
    const state = ev.detail.value;
    this.setState(state);
  }

  onSortChange(ev: any) {
    const criteria = ev.detail.value;
    this.setSortCriteria(criteria);
  }
}
