import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule]
})
export class FaqComponent {
  
  adoptionProcessFAQ: FAQItem[] = [
    {
      question: "Como funciona o processo de adoção?",
      answer: "O processo de adoção é simples: 1) Preencha o formulário de interesse, 2) Nossa equipe entrará em contato em até 48h, 3) Agendamos uma entrevista, 4) Após aprovação, você pode conhecer o pet, 5) Finalizamos a adoção com a assinatura dos documentos.",
      isOpen: false
    },
    {
      question: "Quanto tempo demora o processo de adoção?",
      answer: "O processo completo pode levar de 3 a 7 dias úteis, dependendo da disponibilidade para entrevista e documentação. Nosso objetivo é agilizar ao máximo para que você e seu novo amigo se encontrem rapidamente.",
      isOpen: false
    },
    {
      question: "Posso adotar mais de um pet?",
      answer: "Sim! Adoramos quando famílias adotam múltiplos pets. Avaliaremos cada caso individualmente para garantir que você tenha condições de cuidar bem de todos os seus novos amigos.",
      isOpen: false
    },
    {
      question: "Há algum período de teste ou adaptação?",
      answer: "Sim, oferecemos um período de adaptação de 15 dias. Durante este tempo, você pode conhecer melhor o pet e garantir que é a escolha certa para sua família. Estaremos sempre disponíveis para apoio.",
      isOpen: false
    }
  ];

  requirementsFAQ: FAQItem[] = [
    {
      question: "Quais documentos preciso para adotar?",
      answer: "Você precisará de: RG, CPF, comprovante de residência, comprovante de renda, termo de responsabilidade assinado e comprovação de que o local onde o pet viverá é adequado (fotos do ambiente).",
      isOpen: false
    },
    {
      question: "Preciso ter experiência prévia com pets?",
      answer: "Não é obrigatório ter experiência prévia, mas é importante estar disposto a aprender sobre cuidados com pets. Oferecemos orientações e suporte para famílias iniciantes.",
      isOpen: false
    },
    {
      question: "Qual a idade mínima para adotar?",
      answer: "Você deve ter pelo menos 18 anos para adotar um pet. Menores de idade podem participar do processo, mas a responsabilidade legal será dos pais ou responsáveis.",
      isOpen: false
    },
    {
      question: "Posso adotar se moro em apartamento?",
      answer: "Sim! Muitos pets se adaptam muito bem à vida em apartamento. Avaliaremos o tamanho do pet, seu nível de energia e as condições do seu lar para garantir uma boa adaptação.",
      isOpen: false
    }
  ];

  careFAQ: FAQItem[] = [
    {
      question: "Quais cuidados básicos preciso ter com meu pet?",
      answer: "Cuidados essenciais incluem: alimentação adequada, água sempre disponível, exercícios regulares, higiene (banhos, escovação), vacinação em dia, visitas regulares ao veterinário, carinho e atenção. Forneceremos um guia completo de cuidados.",
      isOpen: false
    },
    {
      question: "Como preparar minha casa para receber um pet?",
      answer: "Prepare um cantinho confortável com caminha, comedouro e bebedouro. Remova objetos perigosos, plantas tóxicas e certifique-se que há espaço seguro para o pet se exercitar. Se for filhote, prepare também uma área para treinamento.",
      isOpen: false
    },
    {
      question: "O que fazer se o pet não se adaptar?",
      answer: "É normal que alguns pets precisem de mais tempo para se adaptar. Mantenha a calma, seja paciente e siga nossas orientações. Se após o período de adaptação ainda houver dificuldades, podemos oferecer apoio adicional ou considerar outras opções.",
      isOpen: false
    },
    {
      question: "Posso devolver o pet se não der certo?",
      answer: "Sim, você pode devolver o pet durante o período de adaptação (15 dias). Entendemos que nem sempre a combinação é perfeita e nossa prioridade é o bem-estar do animal. Após esse período, a devolução será avaliada caso a caso.",
      isOpen: false
    }
  ];

  costsFAQ: FAQItem[] = [
    {
      question: "A adoção é gratuita?",
      answer: "Sim! Nossa missão é encontrar lares amorosos para todos os pets, então não cobramos taxa de adoção. Você será responsável apenas pelos custos de cuidados veterinários básicos (vacinas, vermífugos) que são muito acessíveis.",
      isOpen: false
    },
    {
      question: "Quais custos terei após a adoção?",
      answer: "Os custos incluem: alimentação (R$ 50-150/mês dependendo do tamanho), veterinário preventivo (R$ 100-200/mês), brinquedos e acessórios (R$ 30-50/mês). Esses são custos básicos para garantir a saúde e felicidade do seu pet.",
      isOpen: false
    },
    {
      question: "O pet vem vacinado e castrado?",
      answer: "Todos os pets disponíveis para adoção já estão vacinados, vermifugados e, quando possível, castrados. Se o pet ainda não estiver castrado, orientaremos sobre a importância da castração e como proceder.",
      isOpen: false
    },
    {
      question: "Há algum apoio financeiro disponível?",
      answer: "Para famílias em situação de vulnerabilidade social, oferecemos apoio com alimentação e cuidados veterinários básicos. Entre em contato conosco para mais informações sobre os critérios de elegibilidade.",
      isOpen: false
    }
  ];

  toggleFAQ(section: string, index: number): void {

    if (section === 'adoptionProcess') {
      this.adoptionProcessFAQ.forEach((item, i) => {
        item.isOpen = i === index ? !item.isOpen : false;
      });
    } else if (section === 'requirements') {
      this.requirementsFAQ.forEach((item, i) => {
        item.isOpen = i === index ? !item.isOpen : false;
      });
    } else if (section === 'care') {
      this.careFAQ.forEach((item, i) => {
        item.isOpen = i === index ? !item.isOpen : false;
      });
    } else if (section === 'costs') {
      this.costsFAQ.forEach((item, i) => {
        item.isOpen = i === index ? !item.isOpen : false;
      });
    }
  }
}