function wrap_edition(edition) {
  switch (edition._type) {
  case 'ArticleEdition':
    return new ArticleEdition(edition);
  case 'CaseStudyEdition':
    return new CaseStudyEdition(edition);
  case 'CourseEdition':
    return new CourseEdition(edition);
  case 'CourseInstanceEdition':
    return new CourseInstanceEdition(edition);
  case 'EventEdition':
    return new EventEdition(edition);
  case 'JobEdition':
    return new JobEdition(edition);
  case 'NodeEdition':
    return new NodeEdition(edition);
  case 'OrganizationEdition':
    return new OrganizationEdition(edition);
  case 'PersonEdition':
    return new PersonEdition(edition);
  case 'ReportEdition':
    return new ReportEdition(edition);
  case 'TimedItemEdition':
    return new TimedItemEdition(edition);
  default:
    if (edition._type)
      console.log(`No wrapper class for ${edition._type}`);
    return new Edition(edition);
  } // switch ...
} // wrap_edition

module.exports = wrap_edition;

////////////////////////////////////////////////
class Edition {
  constructor(edition) {
    this.business_propostion = false;

    for (const [k,v] of Object.entries(edition))
      this[k] = v;
  } // constructor

  get rendering_path() { return `/${this.slug}`; }
} // class Edition

class ArticleEdition extends Edition {
  constructor(edition) {
    super(edition);
  } // constructor

  get whole_body() { return this.content; }

  get rendering_path() {
    console.log("ArticleEdition work to do in rendering_path?");
    return `/${this.slug}`;
  }
} // ArticleEdition

class CaseStudyEdition extends Edition {
  constructor(edition) {
    super(edition);
  } // constructor

  get whole_body() { return this.content; }

  get rendering_path() { return `/case-studies/${this.slug}`; }
} // CaseStudyEdition

class CourseEdition extends Edition {
  constructor(edition) {
    super(edition);
  } // constructor

  get whole_body() { return this.description; }

  get rendering_path() { return `/courses/${this.slug}`; }
} // class CourseEdition

class CourseInstanceEdition extends Edition {
  constructor(edition) {
    super(edition);
  } // constructor

  get whole_body() { return this.description; }

  get rendering_path() {
    console.log("CourseInstanceEdition - verify rendering_path");
    return `/courses/${this.course}/${this.date}`;
  }
} // class CourseInstanceEdition

class CreativeWorkEdition extends Edition {
  constructor(edition) {
    super(edition);
  } // constructor

  get whole_body() { return this.description; }

  get rendering_path() { return `/culture/${this.slug}`; }
} // CreativeWorkEdition

class EventEdition extends Edition {
  constructor(edition) {
    super(edition);
  } // constructor

  get whole_body() { return this.description; }

  get rendering_path() {
    console.log("EventEdition work to do in rendering_path?");
    return `/${this.slug}`;
  }
} // EventEdition

class JobEdition extends Edition {
  constructor(edition) {
    super(edition);
  } // constructor

  get whole_body() { return this.description; }

  get rendering_path() { return `/jobs/${slug}`; }
} // class JobEdition

class NodeEdition extends Edition {
  constructor(edition) {
    super(edition);
  } // constructor

  get whole_body() { return this.description; }

  get rendering_path() { return `/nodes/${slug}`; }

  get latlng() { return [location[0], location[1]].join(','); }
} // class NodeEdition

class OrganizationEdition extends Edition {
  constructor(edition) {
    super(edition);
  } // constructor

  get whole_body() { return this.description; }

  get rendering_path() {
    console.log("OrganizationEdition work to do in rendering_path?");
    return `/${this.slug}`;
  }
} // class OrganizationEdition

class PersonEdition extends Edition {
  constructor(edition) {
    super(edition);
  } // constructor

  get whole_body() { return this.description; }

  get rendering_path() {
    console.log("PersonEdition work to do in rendering_path?");
    return `/${this.slug}`;
  }
} // class PersonEdition

class ReportEdition extends Edition {
  constructor(edition) {
    super(edition);
  } // constructor

  get whole_body() { return ""; }

  get rendering_path() { return `/reports/${this.slug}`; }
} // class ReportEdition

class TimedItemEdition extends Edition {
  constructor(edition) {
    super(edition);
  } // constructor

  get whole_body() { return this.content; }

  get rendering_path() {
    console.log("TimedItemEdition work to do in rendering_path?");
    return `/${this.slug}`;
  }
} // class TimedItemEdition

/*
def tag_to_rendering_path(url_map)
    section = artefact.tags.map{|x| url_map[x.tag_id]}.compact.uniq.join
    section = url_map[:default] if section.blank? && url_map[:default]
    "#{'/' unless section.blank?}#{section}/#{slug}"
end
*/
