import React from 'react';
import t from 'tcomb-form';
import TagsInput from 'react-tagsinput';

class TagsComponent extends t.form.Component {

  getTemplate() {
    return (locals) => {
      return (
        <TagsInput value={locals.value} onChange={locals.onChange} />
      );
    };
  }

}

export default TagsComponent;