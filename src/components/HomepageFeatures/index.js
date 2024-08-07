import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Record about Algorithm',
    Svg: require('@site/static/img/cover/code.svg').default,
    description: (
      <>
        Summarize and record algorithm problems of various types and sources, 
        and organize the approach to solving them
      </>
    ),
  },
  {
    title: 'Document for Any Code Language',
    Svg: require('@site/static/img/cover/note.svg').default,
    description: (
      <>
        Summarized learning notes on multiple programming languages such as Java, JavaScript, 
        Python, etc. For easy searching and reviewing anytime.
       </>
    ),
  },
  {
    title: 'Blog of High Quality',
    Svg: require('@site/static/img/cover/blog.svg').default,
    description: (
      <>
        Curated various excellent blog articles to better enhance the knowledge learned.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
