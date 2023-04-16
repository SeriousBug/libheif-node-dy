#include <sstream>
#include <string>
#include <node_api.h>
#include <libheif/heif_cxx.h>

#define ASSERT()                                                            \
  do                                                                        \
  {                                                                         \
    if (status != napi_ok)                                                  \
    {                                                                       \
      napi_throw_error(env, "LIBHEIF_NODE", "Unexpected error in libheif"); \
      return nullptr;                                                       \
    }                                                                       \
  } while (0)

namespace libheif_node
{
  std::string heif_error_to_string(const heif::Error &err)
  {
    std::stringstream ss;
    ss << "heif_error: " << err.get_message() << " (" << err.get_code() << ", " << err.get_subcode() << ")";
    return ss.str();
  }

  napi_value
  get_info(napi_env env, napi_callback_info info)
  {
    napi_status status;

    size_t argc = 1;
    napi_value args[1];
    status = napi_get_cb_info(env, info, &argc, args, NULL, NULL);
    ASSERT();

    bool is_buffer = false;
    napi_is_buffer(env, args[0], &is_buffer);
    if (!is_buffer)
    {
      napi_throw_error(env, "EINVAL", "First argument must be a buffer");
      return nullptr;
    }

    void *data;
    size_t buffer_length;
    status = napi_get_buffer_info(env, args[0], &data, &buffer_length);
    ASSERT();

    napi_value result;
    status = napi_create_object(env, &result);
    ASSERT();

    try
    {
      auto ctx = heif::Context();
      ctx.read_from_memory_without_copy(data, buffer_length);
      auto image = ctx.get_primary_image_handle();
      auto width = image.get_width();
      auto height = image.get_height();
      auto has_alpha_channel = image.has_alpha_channel();
      auto luma_bits_per_pixel = image.get_luma_bits_per_pixel();
      auto chroma_bits_per_pixel = image.get_chroma_bits_per_pixel();
      auto is_premultiplied = image.is_premultiplied_alpha();

      napi_value result_width;
      status = napi_create_uint32(env, width, &result_width);
      ASSERT();
      status = napi_set_named_property(env, result, "width", result_width);
      ASSERT();

      napi_value result_height;
      status = napi_create_uint32(env, height, &result_height);
      ASSERT();
      status = napi_set_named_property(env, result, "height", result_height);
      ASSERT();

      napi_value result_is_premultiplied;
      status = napi_get_boolean(env, is_premultiplied, &result_is_premultiplied);
      ASSERT();
      status = napi_set_named_property(env, result, "isPremultiplied", result_is_premultiplied);
      ASSERT();

      napi_value result_has_alpha_channel;
      status = napi_get_boolean(env, has_alpha_channel, &result_has_alpha_channel);
      ASSERT();
      status = napi_set_named_property(env, result, "hasAlphaChannel", result_has_alpha_channel);
      ASSERT();

      napi_value result_luma_bits_per_pixel;
      status = napi_create_uint32(env, luma_bits_per_pixel, &result_luma_bits_per_pixel);
      ASSERT();
      status = napi_set_named_property(env, result, "lumaBitsPerPixel", result_luma_bits_per_pixel);
      ASSERT();

      napi_value result_chroma_bits_per_pixel;
      status = napi_create_uint32(env, chroma_bits_per_pixel, &result_chroma_bits_per_pixel);
      ASSERT();
      status = napi_set_named_property(env, result, "chromaBitsPerPixel", result_chroma_bits_per_pixel);
      ASSERT();
    }
    catch (const heif::Error &err)
    {
      napi_throw_error(env, "LIBHEIF_INTERNAL", heif_error_to_string(err).c_str());
      return nullptr;
    }

    return result;
  }

  napi_value decode(napi_env env, napi_callback_info info)
  {
    napi_status status;

    size_t argc = 1;
    napi_value args[1];
    status = napi_get_cb_info(env, info, &argc, args, NULL, NULL);
    ASSERT();

    bool is_buffer = false;
    napi_is_buffer(env, args[0], &is_buffer);
    if (!is_buffer)
    {
      napi_throw_error(env, "EINVAL", "First argument must be a buffer");
      return nullptr;
    }

    void *data;
    size_t buffer_length;
    status = napi_get_buffer_info(env, args[0], &data, &buffer_length);
    ASSERT();

    napi_value result;

    try
    {
      auto ctx = heif::Context();
      ctx.read_from_memory_without_copy(data, buffer_length);

      auto image = ctx.get_primary_image_handle();

      auto decoded = image.decode_image(heif_colorspace_RGB, heif_chroma_interleaved_RGBA);
      int out_stride;
      const uint8_t *decoded_data = decoded.get_plane(heif_channel_interleaved, &out_stride);

      status = napi_create_buffer_copy(env, out_stride * image.get_height(), decoded_data, NULL, &result);
      ASSERT();
    }
    catch (const heif::Error &err)
    {
      napi_throw_error(env, "LIBHEIF_INTERNAL", heif_error_to_string(err).c_str());
      return nullptr;
    }

    return result;
  }

  napi_value init(napi_env env, napi_value exports)
  {
    napi_status status;

    napi_value fn_decode;
    status = napi_create_function(env, nullptr, 0, decode, nullptr, &fn_decode);
    ASSERT();
    status = napi_set_named_property(env, exports, "decode", fn_decode);
    ASSERT();

    napi_value fn_get_info;
    status = napi_create_function(env, nullptr, 0, get_info, nullptr, &fn_get_info);
    ASSERT();
    status = napi_set_named_property(env, exports, "get_info", fn_get_info);
    ASSERT();

    return exports;
  }

  NAPI_MODULE(NODE_GYP_MODULE_NAME, init);
}
