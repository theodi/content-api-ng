function wrap_artefact(artefact) {
  return new Artefact(artefact);
} // wrap_artefact

module.exports = wrap_artefact;

//////////////////////////////////////////////////////
class Artefact {
  constructor(artefact) {
    for (const [k,v] of Object.entries(artefact))
      this[k] = v;
  } // constructor

  get edition() { return this.edition_; }

  set edition(edition) {
    this.edition_ = edition;
    this.edition_.artefact = this;
  } // set edition

  get excerpt() {
    const whole_body = this.edition ? this.edition.whole_body : '';
    if (!whole_body)
      return '';
    const first_line = whole_body.substr(0, whole_body.indexOf('\n'));
    return first_line;
  } // excerpt

  get rendering_path() {
    return (this.edition_) ? this.edition_.rendering_path : `/${this.slug}`;
  } // rendering_path
}// class Artefact