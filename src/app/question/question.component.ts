import { QuestionService } from './../services/question.service';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

    public name : string = "";
    public questionList : any = [];
    public currentQuestion : number = 0;
    public points : number = 0;
    public counter = 60;
    correctAnswer:number = 0;
    inCorrectAnswer : number = 0;
    intervals$ : any;
    progress : string = "0";
    isQuizCompleted : boolean = false;


    constructor(private questionsService : QuestionService) { }

    ngOnInit(): void {
        this.name = localStorage.getItem("name")!;
        this.getAllQuestions();
        this.startCounter();
    }

    getAllQuestions(){
        this.questionsService.getQuestionJson().subscribe(res => {
            this.questionList = res.questions;
        })
    }

    nextQuestion(){
        this.currentQuestion++;
    }

    previousQuestion(){
        this.currentQuestion--;
    }

    answer(currentQno:number, option:any){
        if(option.correct)
        {
            this.points += 10;
            this.correctAnswer++;
            setTimeout(() => {
                this.currentQuestion++;
                this.resetCounter();
                this.getProgressPercent();
            }, 1000);
        }else{
            setTimeout(() => {
                this.currentQuestion++;
                this.inCorrectAnswer++;
                this.resetCounter();
                this.getProgressPercent();
            }, 1000);
            this.points -= 10;

        }
        setTimeout( () => {
            if(currentQno === this.questionList.length)
            {
                this.isQuizCompleted = true;
                this.stopCounter();
            }
        }, 1000);

    }

    startCounter(){
        this.intervals$ = interval(1000)
        .subscribe(val => {
            this.counter--;
            if(this.counter === 0)
            {
                this.currentQuestion++;
                this.counter = 60;
                this.points -= 10;
            }
        });
        setTimeout(() => {
            this.intervals$.unsubscribe();
        }, 600000);
    }

    stopCounter(){
        this.intervals$.unsubscribe();
        this.counter = 0;
    }

    resetCounter(){
        this.stopCounter();
        this.counter = 60;
        this.startCounter();
    }

    resetQuiz(){
        this.resetCounter();
        this.getAllQuestions();
        this.points = 0;
        this.counter = 60;
        this.currentQuestion = 0;
        this.progress = "0";
    }

    getProgressPercent(){
        this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
        return this.progress;
    }

}
