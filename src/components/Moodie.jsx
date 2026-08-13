export default function Moodie({ size = 'md', state = 'waving' }) {
  const className = `moodie moodie-${size} ${
    state === 'loading' ? 'moodie-searching' : 'moodie-waving'
  }`;

  return (
    <div className={className} aria-hidden="true">
      <div className="moodie-halo" />
      <div className="moodie-head">
        <span className="moodie-eye moodie-eye-left" />
        <span className="moodie-eye moodie-eye-right" />
        <span className="moodie-smile" />
      </div>
      <div className="moodie-sprout">
        <span />
      </div>
      <div className="moodie-spark moodie-spark-one">✦</div>
      <div className="moodie-spark moodie-spark-two">✧</div>
    </div>
  );
}
