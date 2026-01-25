# หัวใจของระบบ (Logic / AI)
def generate_schedule(data):
    result = []
    hours_per_subject = data.available_hours // len(data.subjects)

    for subject in data.subjects:
        result.append(f"{subject}: {hours_per_subject} ชั่วโมง")

    return result
