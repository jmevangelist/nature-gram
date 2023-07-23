import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityIcons, thumbsDownIcon, thumbsUpIcon } from '@cds/core/icon';
import { ClarityModule, ClrLoadingButton, ClrLoadingState } from '@clr/angular';
import { QualityMetric } from '../inaturalist/inaturalist.interface';
import { AuthorizationService } from '../authorization/authorization.service';
import { Metric, MetricType } from './metric.interface';
import { InaturalistService } from '../inaturalist/inaturalist.service';

@Component({
  selector: 'app-quality-metric',
  standalone: true,
  imports: [CommonModule,ClarityModule],
  templateUrl: './quality-metric.component.html',
  styleUrls: ['./quality-metric.component.css']
})
export class QualityMetricComponent implements OnInit {
  metrics: Metric[];

  @Input() qualityMetric!: QualityMetric[];
  @Input() uuid!: string;
  @Input() metric: MetricType[];
  @Input() label!: 'verbose'|'compact';

  private auth: AuthorizationService;
  private inat: InaturalistService;

  constructor(){
    this.auth = inject(AuthorizationService);
    this.inat = inject(InaturalistService);
    this.metrics = [];
    this.qualityMetric = [];
    this.metric = ['wild','evidence'];
    this.label = 'verbose';
    ClarityIcons.addIcons(thumbsUpIcon,thumbsDownIcon)
  }

  ngOnInit(): void {

    this.metric.forEach((m)=>{
      this.metrics.push(this.metricDict[m])
    })

    this.qualityMetric.forEach( (m) => {
      let i = this.metrics.findIndex( me => me.metric == m.metric );
      if(i>=0){  
        if(m.agree){
          this.metrics[i].agree++
        }else{
          this.metrics[i].disagree++
        }

        if(this.auth.me?.id == m.user_id){
          this.metrics[i].voted = m.agree ? 'agree': 'disagree';
        }
      }
    })
  }

  agree(metric:any,ref:ClrLoadingButton){
    ref.loadingStateChange(ClrLoadingState.LOADING);
    let method: "POST" | "DELETE" = metric.voted ? "DELETE" : "POST" 
    this.inat.quality(this.uuid,metric.metric,true,method).then((s)=>{
      if(s){
        if(method == 'POST'){
          metric.voted = 'agree';
          metric.agree++
          this.qualityMetric.push({
            id:0,
            user_id:this.auth.me?.id ?? 0,
            agree:true,
            metric:metric.metric
          })
        }else{
          metric.voted = undefined;
          metric.agree--
          this.qualityMetric.pop();
        }

      }
    }).finally(()=>{
      ref.loadingStateChange(ClrLoadingState.DEFAULT)
    })
  }

  disagree(metric:any,ref:ClrLoadingButton){
    ref.loadingStateChange(ClrLoadingState.LOADING);
    let method: "POST" | "DELETE" = metric.voted ? "DELETE" : "POST" 
    this.inat.quality(this.uuid,metric.metric,false,method).then((s)=>{
      if(s){
        if(method == 'POST'){
          metric.voted = 'disagree';
          metric.disagree++
          this.qualityMetric.push({
            id:0,
            user_id:this.auth.me?.id ?? 0,
            agree:false,
            metric:metric.metric
          })
        }else{
          metric.voted = undefined;
          metric.disagree--
          this.qualityMetric.pop();
        }
      }
    }).finally(()=>{
      ref.loadingStateChange(ClrLoadingState.DEFAULT)
    })
  }

  private metricDict: {[key:string]:any} = {
    'wild': { metric: 'wild', agree: 0, disagree: 0, label: 'Organism is wild', voted: undefined },
    'evidence': { metric: 'evidence', agree: 0, disagree: 0, label: 'Evidence of organism', voted: undefined },
    'recent': { metric: 'recent', agree: 0, disagree: 0, label: 'Recent evidence of an organism', voted: undefined },
    'location': { metric: 'location', agree: 0, disagree: 0, label: 'Location is accurate', voted: undefined  },
    'date': { metric: 'date', agree: 0, disagree: 0, label: 'Date is accurate', voted: undefined },
  }

}
