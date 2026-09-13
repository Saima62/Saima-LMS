import { createCourse } from './actions';

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-ink mb-1">New course</h1>
      <p className="text-ink/60 text-sm mb-8">
        Starts as a draft — it won't appear on the public site until you publish it from the course page.
      </p>

      <form action={createCourse} className="space-y-5">
        <div>
          <label className="block text-sm text-ink mb-1">Course title</label>
          <input name="title" required className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" placeholder="Spoken English" />
        </div>

        <div>
          <label className="block text-sm text-ink mb-1">Short description (shown on course cards)</label>
          <input
            name="short_description"
            className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
            placeholder="Build real speaking confidence in 8 weeks."
          />
        </div>

        <div>
          <label className="block text-sm text-ink mb-1">Full description</label>
          <textarea name="description" rows={5} className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm text-ink mb-1">Learning objectives (one per line)</label>
          <textarea
            name="learning_objectives"
            rows={4}
            className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm"
            placeholder={'Speak with confidence in everyday situations\nUse correct grammar naturally while speaking\n...'}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink mb-1">Cover image URL</label>
            <input name="cover_image_url" className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Level</label>
            <select name="level" className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm">
              <option value="all_levels">All levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink mb-1">Price (PKR, 0 = free)</label>
            <input name="price" type="number" min="0" step="1" defaultValue={0} className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Duration (weeks)</label>
            <input name="duration_weeks" type="number" min="1" className="w-full border border-academy-100 rounded-sm px-3 py-2 text-sm" />
          </div>
        </div>

        <button className="text-sm bg-ink text-paper px-5 py-2.5 rounded-sm hover:bg-academy-700 transition-colors">
          Create course
        </button>
      </form>
    </div>
  );
}
