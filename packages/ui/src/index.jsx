import React from 'react';
import './styles.css';

export const Button=({children,variant='primary',className='',...p})=><button className={`btn btn-${variant} ${className}`} {...p}>{children}</button>;
export const Card=({children,className=''})=><section className={`card ${className}`}>{children}</section>;
export const Badge=({children,tone='neutral'})=><span className={`badge badge-${tone}`}>{children}</span>;
export const StatCard=({label,value,delta,icon})=><Card className="stat"><div className="stat-top"><span>{icon}</span><Badge tone={delta?.startsWith('-')?'danger':'success'}>{delta}</Badge></div><strong>{value}</strong><span>{label}</span></Card>;
export const Spinner=()=> <div className="spinner" aria-label="Loading"/>;
export const EmptyState=({title='Nothing here yet',text='There is no data to display.'})=><div className="state"><div className="state-icon">○</div><h3>{title}</h3><p>{text}</p></div>;
export const ErrorState=({onRetry})=><div className="state"><div className="state-icon">!</div><h3>Something went wrong</h3><p>We couldn't load this section. Please try again.</p>{onRetry&&<Button onClick={onRetry}>Retry</Button>}</div>;
export const Skeleton=({rows=4})=><div className="skeleton-list">{Array.from({length:rows},(_,i)=><div className="skeleton" key={i}/>)}</div>;
